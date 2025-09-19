import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Users, Target, Award } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";

const Company = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* 헤더 */}
      <MobileHeader title="회사소개" />

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8">
        {/* 1) 말랑이란 - 좌측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-1"
              src="/images/roulette/말랑이란.png"
              alt="말랑이란"
              style={{
                animation: "slideInFromLeft 1s ease-out, float 3s ease-in-out infinite 1.5s"
              }}
            />
          </div>
        </section>

        {/* 2) 말랑뜻 - 우측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-2"
              src="/images/roulette/말랑뜻.png"
              alt="말랑뜻"
              style={{
                animation: "slideInFromRight 1s ease-out, float 3s ease-in-out infinite 2s"
              }}
            />
          </div>
        </section>

        {/* 3) 말랑로고 - 좌측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain malrang-slide"
              src="/images/roulette/말랑로고.png"
              alt="말랑 로고"
              style={{
                animation: "slideInMALRANG 1.5s ease-out, float 3s ease-in-out infinite 2.5s"
              }}
            />
          </div>
        </section>

        {/* 4) 말랑소개 - 좌측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-1"
              src="/images/roulette/말랑소개.png"
              alt="말랑소개"
              style={{
                animation: "slideInFromLeft 1s ease-out, float 3s ease-in-out infinite 3s"
              }}
            />
          </div>
        </section>

        {/* 5) 말랑프렌즈 - 우측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-2"
              src="/images/roulette/말랑프렌즈.png"
              alt="말랑프렌즈"
              style={{
                animation: "slideInFromRight 1s ease-out, float 3s ease-in-out infinite 3.5s"
              }}
            />
          </div>
        </section>

        {/* 6) 말랑간판 - 좌측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-1"
              src="/images/roulette/말랑간판.png"
              alt="말랑간판"
              style={{
                animation: "slideInFromLeft 1s ease-out, float 3s ease-in-out infinite 4s"
              }}
            />
          </div>
        </section>

        {/* 7) 말랑배경 - 우측에서 슬라이드 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-2"
              src="/images/roulette/말랑배경.gif"
              alt="말랑배경"
              style={{
                animation: "slideInFromRight 1s ease-out, float 3s ease-in-out infinite 4.5s"
              }}
            />
          </div>
        </section>

        {/* 말랑캐릭터 섹션 추가 */}
        <section className="w-full flex items-center justify-center py-3.5 px-3 my-3">
          <div className="w-full max-w-[540px] mx-auto flex items-center justify-center relative">
            <img
              className="block w-[80vw] max-w-[540px] h-auto object-contain float-animation-1"
              src="/images/roulette/말랑캐릭터.png"
              alt="말랑캐릭터"
              style={{
                animation: "slideInFromLeft 1s ease-out, float 3s ease-in-out infinite 5s"
              }}
            />
          </div>
        </section>

        {/* 특징 카드들 */}
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <img
                  src="/images/roulette/말랑캐릭터.png"
                  alt="말랑캐릭터"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">따뜻한 마음</h3>
                <p className="text-sm text-rose-600">모든 사람이 따뜻한 마음을 나눌 수 있도록</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">함께하는 기부</h3>
                <p className="text-sm text-rose-600">혼자가 아닌 함께하는 기부 문화</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Target size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">투명한 관리</h3>
                <p className="text-sm text-rose-600">모든 기부 내역을 투명하게 관리</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Award size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 mb-1">의미있는 변화</h3>
                <p className="text-sm text-rose-600">작은 기부가 큰 변화를 만들어냅니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg"
          >
            말랑과 함께하기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Company;
