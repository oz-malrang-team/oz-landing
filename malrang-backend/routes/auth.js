// routes/auth.js
// 인증 관련 API 라우트 (로그인, 회원가입, 로그아웃)

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const { isValidEmail, isStrongPassword, successResponse, errorResponse } = require("../utils/helpers");

const router = express.Router();

// MongoDB 연결 상태 확인
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// 테스트 사용자 생성 (개발 환경에서만)
router.post("/create-test-user", async (req, res) => {
  // 임시로 환경 체크 비활성화
  // if (process.env.NODE_ENV !== "development") {
  //   return res.status(403).json(errorResponse("이 기능은 개발 환경에서만 사용 가능합니다."));
  // }

  try {
    if (!isMongoConnected()) {
      return res.json(successResponse("MongoDB가 연결되지 않았습니다. 테스트 모드로 실행됩니다.", {
        email: "test@malrang.com",
        password: "test1234",
        mode: "test"
      }));
    }

    // 기존 테스트 사용자 확인
    const existingUser = await User.findOne({ email: "test@malrang.com" });
    if (existingUser) {
      return res.json(successResponse("테스트 사용자가 이미 존재합니다.", {
        email: "test@malrang.com",
        password: "test1234"
      }));
    }

    // 테스트 사용자 생성
    const hashedPassword = await bcrypt.hash("test1234", 12);
    const testUser = new User({
      email: "test@malrang.com",
      password: hashedPassword,
      name: "김말랑",
      phone: "010-1234-5678",
      bio: "테스트 사용자입니다"
    });

    await testUser.save();
    
    res.json(successResponse("테스트 사용자가 생성되었습니다.", {
      email: "test@malrang.com",
      password: "test1234"
    }));

  } catch (error) {
    console.error("테스트 사용자 생성 오류:", error);
    res.json(successResponse("테스트 사용자 준비 완료 (메모리 모드)", {
      email: "test@malrang.com",
      password: "test1234"
    }));
  }
});

// 회원가입
router.post("/register", async (req, res) => {
  try {
    console.log("회원가입 요청 받음:", req.body);
    
    const { email, password, name, phone } = req.body;

    // 입력값 검증
    if (!email || !password || !name || !phone) {
      console.log("필드 누락:", { email: !!email, password: !!password, name: !!name, phone: !!phone });
      return res.status(400).json(errorResponse("모든 필드를 입력해주세요."));
    }

    if (!isValidEmail(email)) {
      console.log("이메일 형식 오류:", email);
      return res.status(400).json(errorResponse("올바른 이메일 형식이 아닙니다."));
    }

    if (!isStrongPassword(password)) {
      console.log("비밀번호 강도 부족:", password);
      return res.status(400).json(errorResponse("비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다."));
    }

    // MongoDB 연결 상태 확인
    if (!isMongoConnected()) {
      console.log("MongoDB 연결되지 않음 - 테스트 모드로 처리");
      
      // 테스트 사용자 회원가입 허용
      if (email === "test@malrang.com") {
        const jwtSecret = process.env.JWT_SECRET || "malrang-secret-key-for-development";
        const testUserId = "507f1f77bcf86cd799439011"; // 임시 ObjectId
        
        const accessToken = jwt.sign(
          { userId: testUserId, email: "test@malrang.com" },
          jwtSecret,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { userId: testUserId },
          jwtSecret,
          { expiresIn: "7d" }
        );

        return res.status(201).json(successResponse("회원가입이 완료되었습니다. (테스트 모드)", {
          accessToken,
          refreshToken,
          user: {
            id: testUserId,
            email: "test@malrang.com",
            name: name
          }
        }));
      }
      
      return res.status(503).json(errorResponse("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요."));
    }

    try {
      console.log("데이터베이스 작업 시작...");
      
      // 이메일 중복 확인
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("중복된 이메일:", email);
        return res.status(400).json(errorResponse("이미 가입된 이메일입니다."));
      }

      console.log("비밀번호 해싱 시작...");
      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(password, 12);
      
      console.log("사용자 객체 생성...");
      // 사용자 생성
      const user = new User({
        email,
        password: hashedPassword,
        name,
        phone
      });

      console.log("데이터베이스에 사용자 저장 중...");
      await user.save();
      console.log("사용자 저장 완료, ID:", user._id);

      // JWT 토큰 생성
      console.log("JWT 토큰 생성 중...");
      const jwtSecret = process.env.JWT_SECRET || "malrang-secret-key-for-development";
      
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: "7d" }
      );

      console.log("회원가입 성공, 응답 전송 중...");
      res.status(201).json(successResponse("회원가입이 완료되었습니다.", {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }));

    } catch (dbError) {
      console.error("데이터베이스 오류:", dbError);
      return res.status(500).json(errorResponse("데이터베이스 처리 중 오류가 발생했습니다."));
    }

  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json(errorResponse("회원가입 처리 중 오류가 발생했습니다."));
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    console.log("=== 로그인 요청 받음 ===");
    console.log("요청 헤더:", req.headers);
    console.log("요청 본문:", req.body);
    console.log("요청 IP:", req.ip);
    console.log("요청 URL:", req.url);
    console.log("요청 메서드:", req.method);
    
    const { email, password } = req.body;

    // 입력값 검증
    if (!email || !password) {
      console.log("필드 누락:", { email: !!email, password: !!password });
      return res.status(400).json(errorResponse("이메일과 비밀번호를 모두 입력해주세요."));
    }

    if (!isValidEmail(email)) {
      console.log("이메일 형식 오류:", email);
      return res.status(400).json(errorResponse("올바른 이메일 형식이 아닙니다."));
    }

    // MongoDB 연결 상태 확인
    if (!isMongoConnected()) {
      console.log("MongoDB 연결되지 않음 - 테스트 모드로 처리");
      
      // 테스트 사용자 로그인 허용
      if (email === "test@malrang.com" && password === "test1234") {
        console.log("테스트 사용자 로그인 처리");
        const jwtSecret = process.env.JWT_SECRET || "malrang-secret-key-for-development";
        
        const testUserId = "507f1f77bcf86cd799439011"; // 임시 ObjectId
        const accessToken = jwt.sign(
          { userId: testUserId, email: "test@malrang.com" },
          jwtSecret,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { userId: testUserId },
          jwtSecret,
          { expiresIn: "7d" }
        );

        return res.json(successResponse("로그인 성공 (테스트 모드)", {
          accessToken,
          refreshToken,
          user: {
            id: testUserId,
            email: "test@malrang.com",
            name: "테스트 사용자"
          }
        }));
      }
      
      return res.status(503).json(errorResponse("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요."));
    }

    try {
      console.log("사용자 조회 시작:", email);
      // 사용자 조회
      const user = await User.findOne({ email });
      if (!user) {
        console.log("사용자 없음:", email);
        return res.status(400).json(errorResponse("가입되지 않은 이메일입니다."));
      }

      console.log("비밀번호 확인 시작");
      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("비밀번호 불일치");
        return res.status(400).json(errorResponse("비밀번호가 일치하지 않습니다."));
      }

      console.log("JWT 토큰 생성 시작");
      // JWT 토큰 생성
      const jwtSecret = process.env.JWT_SECRET || "malrang-secret-key-for-development";
      
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: "7d" }
      );

      console.log("로그인 성공, 응답 전송 중");
      res.json(successResponse("로그인 성공", {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }));

    } catch (dbError) {
      console.error("데이터베이스 연결 오류:", dbError);
      return res.status(500).json(errorResponse("데이터베이스 처리 중 오류가 발생했습니다."));
    }

  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json(errorResponse("로그인 처리 중 오류가 발생했습니다."));
  }
});

// 토큰 새로고침
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(errorResponse("리프레시 토큰이 필요합니다."));
    }

    const jwtSecret = process.env.JWT_SECRET || "malrang-secret-key-for-development";
    const decoded = jwt.verify(refreshToken, jwtSecret);
    
    if (!isMongoConnected()) {
      return res.status(503).json(errorResponse("데이터베이스 연결에 실패했습니다."));
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json(errorResponse("유효하지 않은 토큰입니다."));
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json(successResponse("토큰이 새로고침되었습니다.", { accessToken }));

  } catch (error) {
    console.error("토큰 새로고침 오류:", error);
    res.status(401).json(errorResponse("유효하지 않은 토큰입니다."));
  }
});

// 로그아웃
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // 실제 구현에서는 refreshToken을 블랙리스트에 추가
    // 여기서는 단순히 성공 응답만 반환
    
    res.json(successResponse("로그아웃되었습니다."));

  } catch (error) {
    console.error("로그아웃 오류:", error);
    res.status(500).json(errorResponse("로그아웃 처리 중 오류가 발생했습니다."));
  }
});

// 사용자 정보 조회
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      // 테스트 모드에서 사용자 정보 반환
      if (req.user.userId === "507f1f77bcf86cd799439011") {
        return res.json(successResponse("사용자 정보 조회 성공 (테스트 모드)", {
          _id: "507f1f77bcf86cd799439011",
          email: "test@malrang.com",
          name: "테스트 사용자",
          phone: "010-1234-5678",
          bio: "테스트 사용자입니다",
          donationGoal: 100000,
          isPublicProfile: true,
          joinDate: new Date()
        }));
      }
      return res.status(503).json(errorResponse("데이터베이스 연결에 실패했습니다."));
    }
    
    const user = await User.findById(req.user.userId).select("-password");
    
    if (!user) {
      return res.status(404).json(errorResponse("사용자를 찾을 수 없습니다."));
    }

    res.json(successResponse("사용자 정보 조회 성공", user));

  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json(errorResponse("사용자 정보 조회 중 오류가 발생했습니다."));
  }
});

module.exports = router;
