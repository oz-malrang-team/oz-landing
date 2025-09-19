import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

export default function PaymentModal({ isOpen, onClose, amount, onConfirm, isLoading = false }) {
  const [selectedMethod, setSelectedMethod] = useState("card");
  
  const paymentMethods = [
    { id: "card", name: "신용카드/체크카드", icon: "💳" },
    { id: "kakao", name: "카카오페이", icon: "🟡" },
    { id: "toss", name: "토스페이", icon: "🔵" }
  ];

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-sm mx-auto rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto" data-testid="modal-payment">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4 text-rose-900" data-testid="text-payment-title">
            결제
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 후원 금액 */}
          <div className="text-center space-y-2">
            <p className="text-sm text-rose-600">
              후원금액
            </p>
            <p className="text-3xl font-bold text-rose-600" data-testid="text-payment-amount">
              {amount.toLocaleString("ko-KR")}원
            </p>
          </div>
          
          {/* 결제 수단 선택 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-rose-900">결제 수단</p>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left hover:scale-105 active:scale-95 transition-all touch-manipulation min-h-[52px] ${
                    selectedMethod === method.id
                      ? "border-rose-400 bg-rose-50 text-rose-900"
                      : "border-rose-200 bg-white text-rose-900"
                  }`}
                  data-testid={`button-payment-${method.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* 안내 메시지 */}
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
            <p className="text-xs text-rose-600 text-center leading-relaxed" data-testid="text-payment-description">
              🌟 안전한 결제 시스템을 통해 처리됩니다<br/>
              결제 후 기부 내역에 자동으로 기록됩니다
            </p>
          </div>
          
          {/* 결제 버튼 */}
          <div className="space-y-3">
            <Button 
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-bold rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[52px] bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
              data-testid="button-confirm-payment"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>결제 처리중...</span>
                </div>
              ) : (
                `${amount.toLocaleString("ko-KR")}원 결제하기`
              )}
            </Button>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="block w-full text-center text-sm text-rose-500 underline hover:text-rose-700 transition-colors disabled:opacity-50"
              data-testid="button-close-payment"
            >
              취소
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
