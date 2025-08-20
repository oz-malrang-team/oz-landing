import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Receipt, Calendar, Download, Settings, User, Bell, LogOut, ChevronRight, Edit, Share2 } from 'lucide-react';

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState('history');
  const [currentMonth, setCurrentMonth] = useState({ year: 2024, month: 8 });

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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">마이페이지</h1>
          </div>
          <button className="p-2">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="pb-6">
        {/* 프로필 카드 */}
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6 m-5 rounded-3xl shadow-sm">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-full flex items-center justify-center text-4xl shadow-lg">
                😊
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Edit size={14} className="text-gray-600" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">마음씨님</h2>
            <p className="text-gray-600 text-sm mb-6">hearts@example.com</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
                <div className="text-2xl font-bold text-pink-600 mb-1">{donationHistory.length}</div>
                <div className="text-xs text-gray-600">총 기부횟수</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
                <div className="text-lg font-bold text-pink-600 mb-1">{formatNumber(getTotalAmount())}원</div>
                <div className="text-xs text-gray-600">총 기부금액</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 text-gray-800 py-3 px-6 rounded-2xl text-sm font-bold mb-4">
              🏆 따뜻한 마음 단계
            </div>
            
            <button className="bg-white/70 backdrop-blur-sm text-pink-600 border-2 border-pink-200 px-6 py-3 rounded-2xl font-medium hover:bg-white transition-colors">
              프로필 수정
            </button>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="px-5 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <Share2 size={20} className="text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">내역 공유</span>
            </button>
            <button className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Download size={20} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">영수증 다운</span>
            </button>
            <button className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Bell size={20} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">알림 설정</span>
            </button>
          </div>
        </div>

        {/* 메뉴 탭 */}
        <div className="px-5 mb-6">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {[
              { id: 'history', label: '기부 내역', icon: TrendingUp },
              { id: 'receipts', label: '영수증', icon: Receipt },
              { id: 'stats', label: '월별 통계', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all duration-200 ${
                  selectedTab === id 
                    ? 'bg-white text-pink-600 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="px-5">
          {selectedTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">최근 기부 활동</h3>
                <button className="text-pink-600 text-sm font-medium">전체보기</button>
              </div>
              
              {donationHistory.slice(0, 5).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-pink-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{item.organization}</h4>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{formatDate(item.date)}</p>
                      <p className="text-gray-500 text-xs">영수증 {item.receipt ? '발급 완료' : '발급 대기'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-pink-600 font-bold text-lg">{formatNumber(item.amount)}원</div>
                      <button className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-lg mt-1 hover:bg-green-200 transition-colors">
                        영수증 보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'receipts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">기부금 영수증</h3>
                <button className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                  전체 다운로드
                </button>
              </div>
              
              {donationHistory.filter(item => item.receipt).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Receipt size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{item.organization} 기부금 영수증</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(item.date).getFullYear()}년 {new Date(item.date).getMonth() + 1}월</span>
                        <span>•</span>
                        <span className="text-pink-600 font-medium">{formatNumber(item.amount)}원</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">발급완료</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        미리보기
                      </button>
                      <button className="bg-green-100 text-green-700 text-sm px-3 py-2 rounded-lg hover:bg-green-200 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">기부 통계</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => changeMonth(-1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    ‹
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                    {currentMonth.year}년 {currentMonth.month}월
                  </span>
                  <button 
                    onClick={() => changeMonth(1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    ›
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-5 rounded-2xl">
                  <div className="text-3xl mb-3">💰</div>
                  <div className="text-xl font-bold text-pink-600 mb-1">{formatNumber(getMonthlyAmount())}원</div>
                  <div className="text-sm text-gray-600">이번달 기부금액</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-5 rounded-2xl">
                  <div className="text-3xl mb-3">🎯</div>
                  <div className="text-xl font-bold text-purple-600 mb-1">{getMonthlyCount()}회</div>
                  <div className="text-sm text-gray-600">이번달 기부횟수</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-5 rounded-2xl">
                  <div className="text-3xl mb-3">🏥</div>
                  <div className="text-sm font-bold text-blue-600 mb-1">{getFavoriteOrganization()}</div>
                  <div className="text-sm text-gray-600">가장 많이 기부한 곳</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-2xl">
                  <div className="text-3xl mb-3">📈</div>
                  <div className="text-xl font-bold text-green-600 mb-1">{formatNumber(getAverageAmount())}원</div>
                  <div className="text-sm text-gray-600">평균 기부금액</div>
                </div>
              </div>

              {/* 월별 트렌드 차트 영역 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">월별 기부 트렌드</h4>
                <div className="h-32 bg-gradient-to-t from-pink-50 to-white rounded-xl flex items-end justify-center">
                  <div className="text-gray-500 text-sm">차트 영역 (추후 구현)</div>
                </div>
              </div>

              {/* 카테고리별 통계 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">카테고리별 기부 현황</h4>
                <div className="space-y-3">
                  {['의료지원', '동물보호', '환경보호', '교육지원', '복지지원'].map((category, index) => {
                    const categoryItems = donationHistory.filter(item => item.category === category);
                    const categoryAmount = categoryItems.reduce((sum, item) => sum + item.amount, 0);
                    const percentage = getTotalAmount() > 0 ? (categoryAmount / getTotalAmount() * 100) : 0;
                    
                    return (
                      <div key={category} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{
                          backgroundColor: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index]
                        }}></div>
                        <span className="text-sm text-gray-700 flex-1">{category}</span>
                        <span className="text-sm font-medium text-gray-800">{percentage.toFixed(1)}%</span>
                        <span className="text-sm text-gray-500">{formatNumber(categoryAmount)}원</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 설정 메뉴 */}
        <div className="px-5 mt-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">설정 및 도움말</h3>
            </div>
            
            {[
              { icon: '🔔', label: '알림 설정', desc: '기부 완료 및 이벤트 알림' },
              { icon: '🔒', label: '개인정보 설정', desc: '계정 및 보안 관리' },
              { icon: '📞', label: '고객센터', desc: '문의사항 및 도움말' },
              { icon: '📋', label: '이용약관', desc: '서비스 이용약관 확인' }
            ].map((item, index) => (
              <button
                key={index}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            ))}
            
            <button className="w-full p-4 flex items-center gap-4 hover:bg-red-50 transition-colors text-red-600">
              <LogOut size={20} />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;