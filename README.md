# Malrang Project

## 프로젝트 개요
말랑 기부 플랫폼 - 개인 기부 활동 관리 및 커뮤니티 서비스

## 기술 스택
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React.js, React Router, Axios, Tailwind CSS

## 프로젝트 구조
\\\
malrang-project/
├── malrang-backend/          # 백엔드 API 서버
│   ├── config/               # 데이터베이스 설정
│   ├── middleware/           # 인증 미들웨어
│   ├── models/               # MongoDB 모델
│   ├── routes/               # API 라우트
│   └── utils/                # 유틸리티 함수
├── malrang-frontend/         # 프론트엔드 React 앱
│   ├── public/               # 정적 파일
│   ├── src/                  # 소스 코드
│   │   ├── components/       # React 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── hooks/            # 커스텀 훅
│   │   └── services/         # API 서비스
│   └── tailwind.config.js    # Tailwind 설정
└── README.md                 # 프로젝트 문서
\\\

## 설치 및 실행

### 백엔드 실행
\\\ash
cd malrang-backend
npm install
npm start
\\\

### 프론트엔드 실행
\\\ash
cd malrang-frontend
npm install
npm start
\\\

## 주요 기능
- 사용자 인증 (회원가입, 로그인)
- 프로필 관리
- 고객센터 (FAQ, 문의하기)
- 연말정산 탭
- 반응형 UI

## API 엔드포인트
- \POST /api/auth/register\ - 회원가입
- \POST /api/auth/login\ - 로그인
- \GET /api/user/profile\ - 프로필 조회
- \GET /api/support/faq\ - FAQ 목록
- \POST /api/support/questions\ - 문의 등록

## 개발자
Malrang Development Team
