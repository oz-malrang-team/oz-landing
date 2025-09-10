// middleware/auth.js
// JWT 토큰 인증 미들웨어

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" 형식

  if (!token) {
    return res.status(401).json({ 
      error: '접근이 거부되었습니다. 토큰이 필요합니다.' 
    });
  }

  try {
    // 토큰 검증 - fallback 시크릿 추가
    const jwtSecret = process.env.JWT_SECRET || 'malrang-secret-key-for-development';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // 토큰에서 추출한 사용자 정보를 req.user에 저장
    next(); // 다음 미들웨어로 진행
  } catch (error) {
    return res.status(403).json({ 
      error: '유효하지 않은 토큰입니다.' 
    });
  }
};

module.exports = authenticateToken;