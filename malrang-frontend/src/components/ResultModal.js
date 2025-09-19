import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

// 격려 메시지들
const encouragementMessages = [
  "당신의 따뜻함이 누군가의 하루를 밝혀요.",
  "작은 선택이 큰 기적을 만듭니다.", 
  "오늘의 선행, 내일의 희망이 됩니다.",
  "당신 덕분에 세상이 조금 더 포근해졌어요.",
  "나눔의 마음이 오래도록 기억될 거예요.",
  "여러분의 관심이 누군가에게는 특별한 경험을 만들어드릴 수 있어요.",
  "소중한 후원자가 된 나눔으로 정해지지만, 그 모든 결과는 세상에 따뜻한 변화를 만듭니다.",
  "작은 재미가 큰 나눔으로 이어지는 특별한 경험이 될 거예요."
];

export default function ResultModal({ isOpen, onClose, result, onPayment }) {
  // 금액에 따른 특별 메시지 선택
  const amount = result?.amount || 0;
  const message = result?.message || "축하합니다!";
  
  const getEncouragementMessage = (amount) => {
    if (amount >= 10000) {
      return "와! 큰 마음으로 베풀어주시는 것이 정말 감사해요. 당신의 따뜻함이 누군가에게 큰 희망이 될 거예요.";
    } else if (amount >= 5000) {
      return "따뜻한 마음이 느껴져요. 당신의 선택이 누군가의 하루를 특별하게 만들어줄 거예요.";
    } else {
      const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
      return encouragementMessages[randomIndex];
    }
  };
  
  const encouragementMessage = getEncouragementMessage(amount);
  
  console.log("ResultModal 렌더링:", { amount, message, result });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-sm mx-auto rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto" data-testid="modal-result">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-2 text-rose-900" data-testid="text-congratulations">
            🎉 축하합니다! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-sm text-rose-600" data-testid="text-description">
            즐거운 룰렛기부금이 당첨되었습니다.
          </p>
          
          {/* 당첨 금액 표시 */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 border-2 border-rose-200">
            <p className="text-sm text-rose-600 mb-2">당첨 금액</p>
            <div
              className="text-4xl sm:text-5xl font-black text-rose-600 hover:scale-105 active:scale-95 cursor-pointer border-none bg-transparent p-2 rounded-lg transition-transform touch-manipulation min-h-[80px] flex items-center justify-center"
              data-testid="text-amount"
            >
              {amount ? amount.toLocaleString("ko-KR") : "0"}원
            </div>
          </div>
          
          <p className="text-sm text-rose-600 px-2 leading-relaxed" data-testid="text-encouragement">
            {message}
          </p>
          
          <p className="text-xs text-rose-500 px-2 leading-relaxed italic">
            {encouragementMessage}
          </p>
          
          <div className="space-y-3 pt-2">
            <Button 
              onClick={() => onPayment("card")}
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-bold rounded-xl hover:scale-105 active:scale-95 touch-manipulation min-h-[48px] bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
              data-testid="button-payment"
            >
              💝 {amount ? amount.toLocaleString("ko-KR") : "0"}원 기부하기
            </Button>
            
            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-rose-500 underline hover:text-rose-700 transition-colors"
              data-testid="button-close"
            >
              나중에 할게요
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
