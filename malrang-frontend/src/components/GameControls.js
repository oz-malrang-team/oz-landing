import React from "react";

export default function GameControls({ mode, onToggle, onViewResult, helperText, isAuthenticated = true }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      {/* 도움말 텍스트 */}
      <div className="text-center mb-4">
        <p className="text-rose-900 font-medium text-xs leading-relaxed drop-shadow-lg">
          {helperText}
        </p>
      </div>

      {/* 버튼 컨테이너 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* 메인 액션 버튼 */}
        <div className="relative">
          <button
            onClick={onToggle}
            className="group relative overflow-hidden"
            data-testid={mode === "start" ? "button-spin" : "button-stop"}
          >
            {mode === "start" ? (
              <img 
                src="/images/roulette/룰렛버튼start_1757563820947.png"
                alt="룰렛 시작하기"
                className="w-28 h-14 sm:w-32 sm:h-16 object-contain transition-transform group-hover:scale-105 group-active:scale-95 drop-shadow-lg"
              />
            ) : (
              <img 
                src="/images/roulette/룰렛버튼stop_1757563820947.png"
                alt="룰렛 정지하기"
                className="w-28 h-14 sm:w-32 sm:h-16 object-contain transition-transform group-hover:scale-105 group-active:scale-95 drop-shadow-lg"
              />
            )}
            {/* 버튼 글로우 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        {/* 결과 보기 버튼 (로그인한 사용자만) */}
        {isAuthenticated && (
          <button
            onClick={onViewResult}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xs rounded-lg hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all duration-75 touch-manipulation min-h-[40px] shadow-lg border-2 border-white/20"
            data-testid="button-view-result"
          >
            {mode === "start" ? "룰렛결과보기" : "룰렛정지하기"}
          </button>
        )}
      </div>

      {/* 장식 요소 */}
      <div className="flex justify-center mt-3 space-x-2">
        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse drop-shadow-sm"></div>
        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse drop-shadow-sm" style={{animationDelay: '0.2s'}}></div>
        <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse drop-shadow-sm" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );
}
