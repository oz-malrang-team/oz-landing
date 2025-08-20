import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          OZ Landing - 커뮤니티
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          따뜻한 기부 이야기를 나누는 공간입니다
        </p>
        <div className="space-x-4">
          <Link href="/community">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-shadow">
              커뮤니티 바로가기
            </button>
          </Link>
          <Link href="/mypage">
            <button className="bg-gray-800 text-pink-400 border-2 border-pink-500 px-8 py-3 rounded-full font-medium hover:bg-pink-500 hover:text-white transition-colors">
              마이페이지
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 