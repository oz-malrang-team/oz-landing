import React from "react";
import { Link } from "react-router-dom";
import { Users, Target, ArrowRight } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";

const Home = () => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url(\"/images/roulette/룰렛배경_1757563820947.png\")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 to-pink-50/60"></div>

      {/* 헤더 */}
      <div className="relative z-20">
        <MobileHeader title="말랑" />
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8 relative z-10">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo/말랑.png"
              alt="말랑이 로고"
              className="w-32 h-20 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-rose-900 mb-4">
            따뜻한 마음을 전하는<br />기부 플랫폼
          </h2>
          <p className="text-rose-600 leading-relaxed">
            말랑과 함께 세상을 더 따뜻하게 만들어보세요.<br />
            작은 기부도 큰 변화를 만들 수 있습니다.
          </p>
        </div>

        {/* 룰렛 미리보기 섹션 */}
        <div className="glass-card rounded-2xl p-6 shadow-lg border border-rose-100 mb-8 roulette-preview">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-rose-900 mb-2">룰렛 기부 체험</h3>
            <p className="text-sm text-rose-600">룰렛을 돌려서 기부해보세요!</p>
          </div>
          
          {/* 룰렛 휠 미리보기 */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <img
              src="/images/roulette/룰렛판_1757563820947.png"
              alt="룰렛판"
              className="w-full h-full object-contain"
            />
            <img
              src="/images/roulette/룰렛당첨눈금_1757563820946.png"
              alt="룰렛 당첨 눈금"
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-auto z-10"
            />
          </div>
          
          {/* 룰렛 시작 버튼 이미지 사용 */}
          <Link
            to="/roulette"
            className="w-full flex justify-center"
          >
            <img
              src="/images/roulette/룰렛버튼start_1757563820947.png"
              alt="룰렛 시작하기"
              className="w-full max-w-xs h-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* 말풍선 섹션 */}
        <div className="relative mb-8 speech-bubble">
          <img
            src="/images/roulette/기부말풍선_1757563820946.png"
            alt="기부 말풍선"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* 특징 카드들 */}
        <div className="space-y-4 mb-12">
          <div className="glass-card rounded-2xl p-6 shadow-lg border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <img
                  src="/images/roulette/말랑캐릭터.png"
                  alt="말랑이 캐릭터"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">쉽고 간편한 기부</h3>
                <p className="text-sm text-rose-600">몇 번의 터치로 간단하게 기부할 수 있어요</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-lg border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">투명한 기부</h3>
                <p className="text-sm text-rose-600">모든 기부 내역을 투명하게 확인할 수 있어요</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-lg border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Target size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">목표 관리</h3>
                <p className="text-sm text-rose-600">나만의 기부 목표를 세우고 달성해보세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 CTA 버튼들 */}
        <div className="space-y-3">
          <Link
            to="/register"
            className="w-full glass-card text-rose-700 py-3 rounded-xl font-medium border border-rose-300 hover:bg-white transition-colors text-center block shadow-lg btn-hover"
          >
            회원가입
          </Link>
          
          <Link
            to="/login"
            className="w-full text-rose-600 py-3 rounded-xl font-medium hover:text-rose-700 transition-colors text-center block"
          >
            로그인
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="max-w-md mx-auto px-6 py-8 text-center relative z-10">
        <p className="text-rose-500 text-sm">
          © 2024 말랑. 모든 권리 보유.
        </p>
      </footer>
    </div>
  );
};

export default Home;
