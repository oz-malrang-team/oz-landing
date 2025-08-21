import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Receipt, Calendar, Download, Settings, User, Bell, LogOut, ChevronRight, Edit, Share2 } from 'lucide-react';
import { useRouter } from 'next/router';

const MyPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('history');
  const [currentMonth, setCurrentMonth] = useState({ year: 2024, month: 8 });

  // 뒤로가기 함수
  const handleGoBack = () => {
    router.push('/community');
  };

  // 기부 내역 데이터
  const donationHistory = [
    {
      id: 1,
      organization: '어린이병원',
      amount: 3500,
      date: '2024-08-07 14:30',
      emoji: '🏥',
      receipt: true,
      category: '의료지원'
    },
    {
      id: 2,
      organization: '유기동물 보호소',
      amount: 2000,
      date: '2024-08-06 09:15',
      emoji: '🐾',
      receipt: true,
      category: '동물보호'
    },
    {
      id: 3,
      organization: '환경보호 단체',
      amount: 4500,
      date: '2024-08-05 16:45',
      emoji: '🌱',
      receipt: true,
      category: '환경보호'
    },
    {
      id: 4,
      organization: '독거어르신 지원',
      amount: 1500,
      date: '2024-08-04 11:20',
      emoji: '👵',
      receipt: true,
      category: '복지지원'
    },
    {
      id: 5,
      organization: '교육 재단',
      amount: 5000,
      date: '2024-08-03 13:10',
      emoji: '📚',
      receipt: true,
      category: '교육지원'
    },
    {
      id: 6,
      organization: '의료 봉사단',
      amount: 2500,
      date: '2024-08-02 10:30',
      emoji: '⚕️',
      receipt: true,
      category: '의료지원'
    }
  ];

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}.${day} ${hours}:${minutes}`;
  };

  const getTotalAmount = () => {
    return donationHistory.reduce((sum, item) => sum + item.amount, 0);
  };

  const getMonthlyAmount = () => {
    const thisMonth = new Date().getMonth();
    return donationHistory
      .filter(item => new Date(item.date).getMonth() === thisMonth)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getMonthlyCount = () => {
    const thisMonth = new Date().getMonth();
    return donationHistory.filter(item => new Date(item.date).getMonth() === thisMonth).length;
  };

  const getFavoriteOrganization = () => {
    const orgCounts = {};
    donationHistory.forEach(item => {
      orgCounts[item.organization] = (orgCounts[item.organization] || 0) + 1;
    });
    return Object.keys(orgCounts).reduce((a, b) => orgCounts[a] > orgCounts[b] ? a : b);
  };

  const getAverageAmount = () => {
    if (donationHistory.length === 0) return 0;
    return Math.round(getTotalAmount() / donationHistory.length);
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* 헤더 */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-pink-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            title="커뮤니티로 이동"
          >
            <ArrowLeft size={20} className="text-pink-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-pink-900">Malrang</h1>
            <p className="text-sm text-pink-600">나의 기부 활동을 확인해보세요</p>
          </div>
          <button 
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            title="설정"
          >
            <Settings size={20} className="text-pink-600" />
          </button>
        </div>
      </div>

      <div className="pb-6">
        {/* 프로필 섹션 */}
        <div className="bg-gradient-to-br from-white via-pink-50 to-white p-6 m-5 rounded-3xl shadow-lg border border-pink-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              😊
            </div>
            <h2 className="text-xl font-bold text-pink-900 mb-2">마음씨님</h2>
            <p className="text-pink-700 mb-4 text-sm">따뜻한 마음으로 기부하는 분</p>
            <div className="flex justify-center gap-4">
              <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm hover:bg-pink-200 transition-colors border border-pink-200">
                <Edit size={16} className="inline mr-2" />
                프로필 수정
              </button>
              <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm hover:bg-pink-200 transition-colors border border-pink-200">
                <Share2 size={16} className="inline mr-2" />
                공유하기
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="px-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-pink-600 text-sm">이번 달 기부</p>
                  <p className="text-pink-900 font-bold text-lg">{formatNumber(getMonthlyAmount())}원</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-pink-600 text-sm">이번 달 횟수</p>
                  <p className="text-pink-900 font-bold text-lg">{getMonthlyCount()}회</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-5 mb-6">
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-pink-200 shadow-sm">
            {[
              { id: 'history', label: '기부 내역', icon: Receipt },
              { id: 'stats', label: '통계', icon: TrendingUp },
              { id: 'settings', label: '설정', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTab === id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 기부 내역 */}
        {selectedTab === 'history' && (
          <div className="px-5 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-pink-900">기부 내역</h3>
              <button className="text-primary-500 text-sm hover:text-primary-600 transition-colors">
                전체보기
              </button>
            </div>
            {donationHistory.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-pink-200 hover:border-pink-300 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-pink-900">{item.organization}</h4>
                      <span className="text-primary-500 font-bold">{formatNumber(item.amount)}원</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-pink-600">
                      <span>{formatDate(item.date)}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-pink-500 hover:text-primary-600 hover:bg-pink-100 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-pink-500 hover:text-primary-600 hover:bg-pink-100 rounded-lg transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 통계 */}
        {selectedTab === 'stats' && (
          <div className="px-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-sm">
              <h3 className="text-lg font-bold text-pink-900 mb-4">기부 통계</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-pink-600">총 기부 금액</span>
                  <span className="text-pink-900 font-bold text-lg">{formatNumber(getTotalAmount())}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600">총 기부 횟수</span>
                  <span className="text-pink-900 font-bold text-lg">{donationHistory.length}회</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600">자주 기부하는 곳</span>
                  <span className="text-pink-900 font-bold">{getFavoriteOrganization()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 설정 */}
        {selectedTab === 'settings' && (
          <div className="px-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-pink-600" />
                  </div>
                  <span className="text-pink-900 font-medium">계정 정보</span>
                </div>
                <ChevronRight size={20} className="text-pink-400" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-pink-600" />
                  </div>
                  <span className="text-pink-900 font-medium">알림 설정</span>
                </div>
                <ChevronRight size={20} className="text-pink-400" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <LogOut size={20} className="text-pink-600" />
                  </div>
                  <span className="text-pink-900 font-medium">로그아웃</span>
                </div>
                <ChevronRight size={20} className="text-pink-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;