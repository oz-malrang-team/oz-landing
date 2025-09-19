// server.js
// 메인 서버 파일 - 모든 설정과 라우트를 연결

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config(); // 환경변수 로드

// 데이터베이스 연결
const connectDB = require("./config/database");

// 라우트 파일들 import
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const donationRoutes = require("./routes/donations");
const supportRoutes = require("./routes/support");
const rouletteRoutes = require("./routes/roulette"); // 룰렛 라우트 추가
const communityRoutes = require("./routes/community"); // 커뮤니티 라우트 추가

// Express 앱 생성
const app = express();

// 데이터베이스 연결
connectDB();

// 기본 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정

// CORS 설정 - 개발환경에서는 더 관대하게 설정
const corsOptions = {
  origin: function (origin, callback) {
    // 개발 환경에서는 모든 origin 허용 (undefined 포함)
    if (process.env.NODE_ENV === "development" || !origin) {
      callback(null, true);
    } else {
      // 프로덕션에서는 특정 도메인만 허용
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS 정책에 의해 차단됨'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
};

app.use(cors(corsOptions)); // CORS 설정
app.use(express.json({ limit: "10mb" })); // JSON 파싱
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL 인코딩 파싱

// 정적 파일 서빙 개선 - CORS 헤더와 캐시 설정 추가
app.use("/uploads", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'public, max-age=86400'); // 1일 캐시
  next();
}, express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// 개발 환경에서 요청 로깅
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("Body:", req.body);
    }
    next();
  });
}

// Rate Limiting 설정
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // 개발환경에서는 제한 완화
  message: {
    error: "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: process.env.NODE_ENV === "development" ? 100 : 5, // 개발환경에서는 제한 완화
  message: {
    error: "너무 많은 인증 시도입니다. 잠시 후 다시 시도해주세요."
  }
});

// 이미지 직접 반환 API 엔드포인트 (Rate Limiting 전에 설정)
app.get("/api/image/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, "uploads", "posts", filename);
    
    // 파일 존재 확인
    if (!require('fs').existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    // CORS 헤더 설정 (더 명시적으로)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cache-Control', 'public, max-age=86400');
    
    // 파일 확장자에 따른 Content-Type 설정
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                       'image/png';
    
    res.contentType(contentType);
    res.sendFile(imagePath);
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// OPTIONS 요청 처리 (CORS preflight)
app.options("/api/image/:filename", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.sendStatus(200);
});

// 라우트별 Rate Limiting 적용
app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

// API 라우트 연결
app.use("/api/auth", authRoutes);          // 인증 관련: /api/auth/*
app.use("/api/user", userRoutes);          // 사용자 관련: /api/user/*
app.use("/api/donations", donationRoutes); // 기부 관련: /api/donations/*
app.use("/api/support", supportRoutes);    // 고객센터 관련: /api/support/*
app.use("/api/roulette", rouletteRoutes);  // 룰렛 기부 관련: /api/roulette/*
app.use("/api/community", communityRoutes); // 커뮤니티 관련: /api/community/*

// 헬스체크 엔드포인트 (서버 상태 확인용)
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development"
  };
  
  res.json(healthCheck);
});

// 기본 루트 엔드포인트
app.get("/api", (req, res) => {
  res.json({
    message: "Malrang API Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user", 
      donations: "/api/donations",
      support: "/api/support",
      roulette: "/api/roulette",
      community: "/api/community",
      health: "/health"
    }
  });
});

// 프론트엔드 정적 파일 서빙 (프로덕션 빌드)
if (process.env.NODE_ENV === "production") {
  // React 앱의 빌드된 정적 파일들을 서빙
  app.use(express.static(path.join(__dirname, "../malrang-frontend/build")));
  
  // 모든 비-API 요청을 React 앱으로 리다이렉트 (SPA 라우팅 지원)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../malrang-frontend/build/index.html"));
  });
} else {
  // 개발 환경에서는 API 엔드포인트만 제공
  app.get("/", (req, res) => {
    res.json({
      message: "Malrang API Server (Development Mode)",
      version: "1.0.0",
      status: "running",
      note: "프론트엔드는 별도로 실행하세요: cd ../malrang-frontend && npm start",
      endpoints: {
        auth: "/api/auth",
        user: "/api/user", 
        donations: "/api/donations",
        support: "/api/support",
        roulette: "/api/roulette",
        community: "/api/community",
        health: "/health"
      }
    });
  });
}

// 404 에러 핸들링 (존재하지 않는 경로)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `요청한 경로 "${req.originalUrl}"를 찾을 수 없습니다.`,
    availableEndpoints: [
      "GET /",
      "GET /health",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/user/profile",
      "GET /api/donations",
      "POST /api/roulette/roulette-result",
      "POST /api/roulette/roulette-payment"
    ]
  });
});

// 전역 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("서버 에러:", err.stack);

  // Mongoose 유효성 검사 에러
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: "입력값 검증에 실패했습니다.",
      errors
    });
  }

  // Mongoose 중복 키 에러
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field}이(가) 이미 사용 중입니다.`
    });
  }

  // JWT 에러
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다."
    });
  }

  // 기본 서버 에러
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "서버 내부 오류가 발생했습니다." 
      : err.message
  });
});

// 서버 시작
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0"; // 모든 네트워크 인터페이스에서 접속 허용

const server = app.listen(PORT, HOST, () => {
  console.log(`
🚀 Malrang API 서버가 시작되었습니다!
📍 포트: ${PORT}
🌐 호스트: ${HOST}
🌍 환경: ${process.env.NODE_ENV || "development"}
📖 API 문서: http://localhost:${PORT}/
❤️  헬스체크: http://localhost:${PORT}/health
🔗 외부 접속: http://[YOUR_IP]:${PORT}/
  `);
});

// Graceful shutdown 처리
process.on("SIGTERM", () => {
  console.log("SIGTERM 신호를 받았습니다. 서버를 종료합니다...");
  server.close(() => {
    console.log("서버가 정상적으로 종료되었습니다.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT 신호를 받았습니다. 서버를 종료합니다...");
  server.close(() => {
    console.log("서버가 정상적으로 종료되었습니다.");
    process.exit(0);
  });
});

module.exports = app;
