import React from 'react';
import { X, MessageSquare, Camera, Copy } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-rose-200">
          <h3 className="text-lg font-bold text-rose-900">프로필 공유</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
          >
            <X size={20} className="text-rose-600" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-rose-600 mb-6 text-center">
            나의 기부 활동을 친구들과 공유해보세요
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => onShare('kakao')}
              className="w-full p-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <MessageSquare size={20} />
              카카오톡으로 공유
            </button>
            
            <button
              onClick={() => onShare('instagram')}
              className="w-full p-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <Camera size={20} />
              인스타그램 스토리
            </button>
            
            <button
              onClick={() => onShare('copy')}
              className="w-full p-4 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <Copy size={20} />
              링크 복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;