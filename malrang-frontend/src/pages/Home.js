import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Target } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-rose-900">말랑</h1>
            </div>
            <Link
              to="/login"
              className="text-rose-600 hover:text-rose-700 text-sm font-medium"
            >
              로그인
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-rose-900 mb-4">
            따뜻한 마음을 전하는<br />기부 플랫폼
          </h2>
          <p className="text-rose-600 leading-relaxed">
            말랑과 함께 세상을 더 따뜻하게 만들어보세요.<br />
            작은 기부도 큰 변화를 만들 수 있습니다.
          </p>
        </div>

        {/* 특징 카드들 */}
        <div className="space-y-4 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">쉽고 간편한 기부</h3>
                <p className="text-sm text-rose-600">몇 번의 터치로 간단하게 기부할 수 있어요</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
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

        {/* CTA 버튼들 */}
        <div className="space-y-3">
          <Link
            to="/register"
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-center block hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg"
          >
            회원가입
          </Link>
          
          <Link
            to="/login"
            className="w-full bg-rose-100 text-rose-700 py-3 rounded-xl font-medium border border-rose-300 hover:bg-rose-200 transition-colors text-center block"
          >
            로그인
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="max-w-md mx-auto px-6 py-8 text-center">
        <p className="text-rose-500 text-sm">
          © 2024 말랑. 모든 권리 보유.
        </p>
      </footer>
    </div>
  );
};

export default Home; 