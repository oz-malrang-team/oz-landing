import React from "react";
import { Link } from "react-router-dom";

const LoginPromptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">🎯 룰렛 참여 안내</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-rose-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎲</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              룰렛 기부 게임에 참여하시려면<br/>
              먼저 로그인 또는 회원가입을 해주세요!
            </p>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인하기
            </Link>
            
            <Link
              to="/register"
              className="w-full border-2 border-rose-500 text-rose-600 py-3 px-4 rounded-lg font-medium hover:bg-rose-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              회원가입하기
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 transition-colors"
            >
              나중에 하기
            </button>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            💝 회원가입 후 룰렛을 돌려서 기부에 참여해보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal; 