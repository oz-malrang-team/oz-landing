import React from 'react';
import { User, Calendar } from 'lucide-react';

const TabNavigation = ({ selectedTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'calendar', label: '연말정산', icon: Calendar }
  ];

  return (
    <div className="px-5 mb-6">
      <div className="flex gap-2 bg-white p-1 rounded-2xl border border-rose-200 shadow-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              selectedTab === id
                ? 'bg-rose-500 text-white shadow-lg'
                : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;