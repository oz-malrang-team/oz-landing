import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Home, Users, LogIn, UserPlus, Menu, X } from "lucide-react";

export default function MobileHeader({ title = "말랑" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="bg-white shadow-sm relative">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo/말랑.png"
                alt="말랑이 로고"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <h1 className="text-2xl font-bold text-rose-900">{title}</h1>
            </div>
            
            {/* 햄버거 메뉴 버튼 */}
            <button
              onClick={toggleMenu}
              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-rose-100 z-50">
            <div className="max-w-md mx-auto px-6 py-4">
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-rose-600 hover:text-rose-700 text-base font-medium px-3 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Home size={20} />
                  <span>홈</span>
                </Link>
                <Link
                  to="/community"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-rose-600 hover:text-rose-700 text-base font-medium px-3 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Users size={20} />
                  <span>커뮤니티</span>
                </Link>
                <Link
                  to="/mypage"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-rose-600 hover:text-rose-700 text-base font-medium px-3 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <User size={20} />
                  <span>마이페이지</span>
                </Link>
                <div className="border-t border-rose-100 my-2"></div>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-rose-600 hover:text-rose-700 text-base font-medium px-3 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogIn size={20} />
                  <span>로그인</span>
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-rose-700 text-base font-medium px-3 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <UserPlus size={20} />
                  <span>회원가입</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 메뉴 오버레이 (메뉴가 열려있을 때 배경 클릭으로 닫기) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
