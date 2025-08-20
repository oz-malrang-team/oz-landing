# OZ Landing - Next.js 커뮤니티 페이지

## 프로젝트 개요
이 프로젝트는 Next.js를 사용하여 구현된 커뮤니티 페이지입니다. 사용자들이 기부 경험을 공유하고 소통할 수 있는 플랫폼을 제공합니다.

## 주요 기능
- 📱 반응형 디자인
- 🖼️ 사진, 영상, 문서 업로드 지원
- ❤️ 좋아요, 댓글, 공유 기능
- 🔍 필터링 및 정렬 기능
- 🎨 모던한 UI/UX 디자인

## 기술 스택
- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: JavaScript (JSX)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
```
http://localhost:3000/community
```

## 프로젝트 구조
```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── CommunityPage.jsx   # 커뮤니티 메인 페이지
│   └── MyPage.jsx          # 마이페이지 컴포넌트
├── pages/              # Next.js 페이지
│   ├── _app.js         # 앱 메인 파일
│   ├── community.js    # 커뮤니티 페이지
│   └── mypage.js       # 마이페이지
└── styles/             # 스타일 파일
    └── globals.css     # 전역 CSS
```

## 사용법

### CommunityPage 컴포넌트 사용
```jsx
import CommunityPage from '../components/CommunityPage';

const MyPage = () => {
  return <CommunityPage />;
};
```

### 페이지 라우팅
- `/community` - 커뮤니티 메인 페이지
- `/mypage` - 마이페이지

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm start
```

## 커스터마이징

### 스타일 수정
- `tailwind.config.js`에서 Tailwind CSS 설정 수정
- `src/styles/globals.css`에서 전역 스타일 수정

### 컴포넌트 수정
- `src/components/CommunityPage.jsx`에서 커뮤니티 페이지 로직 수정
- 필요한 경우 새로운 컴포넌트 추가

## 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 