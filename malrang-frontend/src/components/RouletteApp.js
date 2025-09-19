import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RouletteWheel from "./RouletteWheel";
import GameControls from "./GameControls";
import ResultModal from "./ResultModal";
import PaymentModal from "./PaymentModal";
import LoginPromptModal from "./LoginPromptModal";
import MobileHeader from "./common/MobileHeader";
import { useAuth } from "../hooks/useAuth";

const RouletteApp = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const rouletteRef = useRef(null);



  const handleSpin = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (isSpinning) return;
    
    rouletteRef.current?.spin();
  }, [isSpinning, isAuthenticated]);

  const handleStop = useCallback(() => {
    if (!isSpinning) return;
    console.log("정지 버튼 클릭");
    rouletteRef.current?.stop();
  }, [isSpinning]);

  const handleRouletteResult = useCallback((prize) => {
    console.log("룰렛 결과 받음:", prize);
    
    const resultData = {
      type: "donation",
      amount: prize,
      message: `${prize.toLocaleString("ko-KR")}원 기부!`
    };
    
    setResult(resultData);
    setIsSpinning(false);
    setShowResult(true);
  }, []);

  const handleViewResult = useCallback(() => {
    if (isSpinning) {
      // 룰렛이 돌아가는 중이면 정지시키고 실제 결과를 기다림
      console.log("룰렛 강제 정지 (결과 보기 버튼 클릭)");
      rouletteRef.current?.stop();
    } else if (result) {
      // 이미 결과가 있으면 결과 모달 표시
      setShowResult(true);
    }
  }, [isSpinning, result]);

  const handleReset = useCallback(() => {
    setIsSpinning(false);
    setResult(null);
    setShowResult(false);
    setShowPayment(false);
  }, []);

  const handleDonate = useCallback(() => {
    setShowResult(false);
    setShowPayment(true);
  }, []);

  const handlePaymentComplete = useCallback((paymentData) => {
    console.log("결제 완료:", paymentData);
    setShowPayment(false);
    handleReset();
  }, [handleReset]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/roulette/룰렛배경_1757563820947.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/70 to-pink-50/70"></div>

      {/* 컨텐츠 */}
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="relative z-20">
          <MobileHeader title="Malrang" />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="max-w-md mx-auto px-6 py-4 relative z-10">
          {/* 룰렛 휠 */}
          <div className="relative w-80 h-80 mx-auto mb-6">
            <RouletteWheel
              isSpinning={isSpinning}
              onResult={handleRouletteResult}
              onSpinningChange={setIsSpinning}
              ref={rouletteRef}
            />
          </div>

          {/* 게임 컨트롤 */}
          <div className="mb-6">
            <GameControls
              mode={isSpinning ? "stop" : "start"}
              onToggle={isSpinning ? handleStop : handleSpin}
              onViewResult={handleViewResult}
              isAuthenticated={isAuthenticated}
              helperText={
                !isAuthenticated
                  ? "로그인 후 룰렛을 돌려보세요!"
                  : isSpinning
                    ? "룰렛이 돌아가고 있습니다..."
                    : "룰렛을 돌려보세요!"
              }
            />
          </div>

          {/* 안내 섹션 - 투명한 배경으로 변경 */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex justify-center mb-2">
              <img 
                src="/images/roulette/말랑캐릭터.png"
                alt="말랑이"
                className="w-10 h-10"
              />
            </div>
            <h3 className="text-base font-bold text-rose-900 mb-2 drop-shadow-lg">룰렛 기부 안내</h3>
            {!isAuthenticated ? (
              <div>
                <p className="text-xs text-rose-800 leading-relaxed mb-3 drop-shadow-md">
                  룰렛을 돌려서 당첨된 금액만큼 기부하세요!<br/>
                  로그인하고 따뜻한 나눔에 참여해보세요.
                </p>
                <div className="flex gap-2 justify-center">
                  <Link to="/login" className="px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-xs font-medium shadow-lg">로그인</Link>
                  <Link to="/register" className="px-3 py-1.5 border border-rose-400 text-rose-800 bg-white/80 rounded-lg hover:bg-white/90 transition-colors text-xs font-medium backdrop-blur-sm">회원가입</Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-800 leading-relaxed drop-shadow-md">
                룰렛을 돌려서 당첨된 금액만큼 기부하세요!<br/>
                작은 기부도 큰 변화를 만들어냅니다.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* 모달들 */}
      {result && (
        <ResultModal
          isOpen={showResult}
          result={result}
          onPayment={handleDonate}
          onClose={() => setShowResult(false)}
        />
      )}

      {showPayment && result && (
        <PaymentModal
          isOpen={showPayment}
          amount={result.amount}
          onConfirm={handlePaymentComplete}
          onClose={() => setShowPayment(false)}
          isLoading={false}
        />
      )}

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
};

export default RouletteApp;
