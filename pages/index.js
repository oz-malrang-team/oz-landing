import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-5">
        <h1 className="text-4xl font-bold text-white mb-6">
          OZ Landing - 기부 전문 플랫폼
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          따뜻한 기부 이야기를 나누고, 전문 지식을 쌓는 공간입니다
        </p>
        
        {/* 메인 기능 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/community">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-lg transition-shadow text-lg">
              💬 커뮤니티
            </button>
          </Link>
          <Link href="/mypage">
            <button className="w-full bg-gray-800 text-pink-400 border-2 border-pink-500 px-8 py-4 rounded-2xl font-medium hover:bg-pink-500 hover:text-white transition-colors text-lg">
              👤 마이페이지
            </button>
          </Link>
        </div>

        {/* 학습 기능 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/problem-solving">
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-medium hover:shadow-lg transition-shadow">
              🧩 문제 풀기
            </button>
          </Link>
          <Link href="/glossary">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-medium hover:shadow-lg transition-shadow">
              📚 용어 사전
            </button>
          </Link>
          <Link href="/certification">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-medium hover:shadow-lg transition-shadow">
              🏆 자격증 시험
            </button>
          </Link>
        </div>

        {/* 설명 텍스트 */}
        <div className="text-gray-400 text-sm space-y-2">
          <p>• 커뮤니티에서 기부 경험을 공유하고 소통하세요</p>
          <p>• 문제 풀기로 기부 관련 지식을 테스트해보세요</p>
          <p>• 용어 사전에서 전문 용어를 쉽게 이해하세요</p>
          <p>• 자격증 시험으로 전문성을 인증받으세요</p>
        </div>
      </div>
    </div>
  );
} 