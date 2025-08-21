import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink-900 mb-6">
          OZ Landing - 커뮤니티
        </h1>
        <p className="text-pink-700 mb-8 text-lg">
          따뜻한 기부 이야기를 나누는 공간입니다
        </p>
        <div className="space-x-4">
          <Link href="/community">
            <button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-200 transform">
              커뮤니티 바로가기
            </button>
          </Link>
          <Link href="/mypage">
            <button className="bg-white text-primary-500 border-2 border-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-500 hover:text-white hover:shadow-lg transition-all duration-200">
              마이페이지
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 