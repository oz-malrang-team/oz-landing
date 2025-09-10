import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';

const Header = ({ title, subtitle, onBack, onSettings, showSettings = true }) => {
  return (
    <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-rose-200">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            title="뒤로가기"
          >
            <ArrowLeft size={20} className="text-rose-600" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-rose-900">{title}</h1>
          {subtitle && <p className="text-sm text-rose-600">{subtitle}</p>}
        </div>
        {showSettings && onSettings && (
          <button
            onClick={onSettings}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            title="설정"
          >
            <Settings size={20} className="text-rose-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;