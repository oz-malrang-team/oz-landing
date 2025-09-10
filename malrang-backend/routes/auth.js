// routes/auth.js
// 인증 관련 API 라우트 (로그인, 회원가입, 로그아웃)

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const { isValidEmail, isStrongPassword, successResponse, errorResponse } = require('../utils/helpers');

const router = express.Router();

// 테스트 사용자 생성 (개발 환경에서만)
router.post('/create-test-user', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json(errorResponse('이 기능은 개발 환경에서만 사용 가능합니다.'));
  }

  try {
    // 기존 테스트 사용자 확인
    const existingUser = await User.findOne({ email: 'test@malrang.com' });
    if (existingUser) {
      return res.json(successResponse('테스트 사용자가 이미 존재합니다.', {
        email: 'test@malrang.com',
        password: 'test1234'
      }));
    }

    // 테스트 사용자 생성
    const hashedPassword = await bcrypt.hash('test1234', 12);
    const testUser = new User({
      email: 'test@malrang.com',
      password: hashedPassword,
      name: '김말랑',
      phone: '010-1234-5678',
      bio: '테스트 사용자입니다'
    });

    await testUser.save();
    
    res.json(successResponse('테스트 사용자가 생성되었습니다.', {
      email: 'test@malrang.com',
      password: 'test1234'
    }));

  } catch (error) {
    console.error('테스트 사용자 생성 오류:', error);
    // MongoDB가 연결되지 않은 경우 임시 응답
    res.json(successResponse('테스트 사용자 준비 완료 (메모리 모드)', {
      email: 'test@malrang.com',
      password: 'test1234'
    }));
  }
});

// 회원가입
router.post('/register', async (req, res) => {
  try {
    console.log('회원가입 요청 받음:', req.body);
    
    const { email, password, name, phone } = req.body;

    // 입력값 검증
    if (!email || !password || !name || !phone) {
      console.log('필드 누락:', { email: !!email, password: !!password, name: !!name, phone: !!phone });
      return res.status(400).json(errorResponse('모든 필드를 입력해주세요.'));
    }

    if (!isValidEmail(email)) {
      console.log('이메일 형식 오류:', email);
      return res.status(400).json(errorResponse('올바른 이메일 형식이 아닙니다.'));
    }

    if (!isStrongPassword(password)) {
      console.log('비밀번호 강도 부족:', password);
      return res.status(400).json(errorResponse('비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다.'));
    }

    try {
      console.log('데이터베이스 작업 시작...');
      
      // 이메일 중복 확인
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('중복된 이메일:', email);
        return res.status(400).json(errorResponse('이미 가입된 이메일입니다.'));
      }

      console.log('비밀번호 해싱 시작...');
      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(password, 12);
      
      console.log('사용자 객체 생성...');
      // 사용자 생성
      const user = new User({
        email,
        password: hashedPassword,
        name,
        phone
      });

      console.log('데이터베이스에 사용자 저장 중...');
      await user.save();
      console.log('사용자 저장 완료, ID:', user._id);

      // JWT 토큰 생성
      console.log('JWT 토큰 생성 중...');
      const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
      
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '7d' }
      );

      console.log('회원가입 성공, 응답 전송 중...');
      res.status(201).json(successResponse('회원가입이 완료되었습니다.', {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }));

    } catch (dbError) {
      // MongoDB 관련 오류 처리
      console.error('데이터베이스 오류:', dbError);
      
      // 테스트 사용자 회원가입 허용 (데이터베이스 없이도 작동)
      if (email === 'test@malrang.com') {
        const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
        const testUserId = '507f1f77bcf86cd799439011'; // 임시 ObjectId
        
        const accessToken = jwt.sign(
          { userId: testUserId, email: 'test@malrang.com' },
          jwtSecret,
          { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
          { userId: testUserId },
          jwtSecret,
          { expiresIn: '7d' }
        );

        return res.status(201).json(successResponse('회원가입이 완료되었습니다. (테스트 모드)', {
          accessToken,
          refreshToken,
          user: {
            id: testUserId,
            email: 'test@malrang.com',
            name: name
          }
        }));
      }
      
      return res.status(500).json(errorResponse('데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'));
    }

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json(errorResponse('회원가입 처리 중 오류가 발생했습니다.'));
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json(errorResponse('이메일과 비밀번호를 모두 입력해주세요.'));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('올바른 이메일 형식이 아닙니다.'));
    }

    try {
      // 사용자 조회
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json(errorResponse('가입되지 않은 이메일입니다.'));
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json(errorResponse('비밀번호가 일치하지 않습니다.'));
      }

      // JWT 토큰 생성
      const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
      
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json(successResponse('로그인 성공', {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }));

    } catch (dbError) {
      // MongoDB 연결 오류 시 테스트 사용자로 fallback
      console.error('데이터베이스 연결 오류:', dbError);
      
      // 테스트 사용자 로그인 허용
      if (email === 'test@malrang.com' && password === 'test1234') {
        const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
        
        const testUserId = '507f1f77bcf86cd799439011'; // 임시 ObjectId
        const accessToken = jwt.sign(
          { userId: testUserId, email: 'test@malrang.com' },
          jwtSecret,
          { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
          { userId: testUserId },
          jwtSecret,
          { expiresIn: '7d' }
        );

        return res.json(successResponse('로그인 성공 (테스트 모드)', {
          accessToken,
          refreshToken,
          user: {
            id: testUserId,
            email: 'test@malrang.com',
            name: '김말랑'
          }
        }));
      }
      
      return res.status(500).json(errorResponse('데이터베이스 연결에 실패했습니다. test@malrang.com / test1234로 테스트해보세요.'));
    }

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json(errorResponse('로그인 처리 중 오류가 발생했습니다.'));
  }
});

// 토큰 새로고침
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(errorResponse('리프레시 토큰이 필요합니다.'));
    }

    const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
    
    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      
      // 새 액세스 토큰 생성
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        jwtSecret,
        { expiresIn: '1h' }
      );

      res.json(successResponse('토큰 새로고침 성공', {
        accessToken: newAccessToken
      }));

    } catch (jwtError) {
      return res.status(401).json(errorResponse('유효하지 않은 리프레시 토큰입니다.'));
    }

  } catch (error) {
    console.error('토큰 새로고침 오류:', error);
    res.status(500).json(errorResponse('토큰 새로고침 중 오류가 발생했습니다.'));
  }
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post('/logout', authenticateToken, (req, res) => {
  res.json(successResponse('로그아웃 되었습니다.'));
});

module.exports = router;