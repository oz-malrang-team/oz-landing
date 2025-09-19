import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, Heart, Target, Calendar, HelpCircle, Shield, CreditCard, Edit3, Key, Receipt, FileText, Phone, Mail } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const MyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [donationStats, setDonationStats] = useState({
    totalAmount: 0,
    donationCount: 0,
    goalProgress: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchDonationStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      if (response.data.success) {
        setUserProfile(response.data.data.user);
        setDonationStats(response.data.data.stats);
      }
    } catch (error) {
      console.error("프로필 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationStats = async () => {
    try {
      const response = await api.get("/donations");
      if (response.data.success) {
        const { summary } = response.data.data;
        setDonationStats(prev => ({
          ...prev,
          totalAmount: summary.totalAmount || 0,
          donationCount: summary.count || 0
        }));
      }
    } catch (error) {
      console.error("기부 통계 조회 실패:", error);
    }
  };



  const handleTabClick = (tabId) => {
    if (tabId === "settings") {
      // 설정 탭 클릭 시 Settings 페이지로 이동
      navigate("/settings");
    } else {
      setActiveTab(tabId);
    }
  };

  const tabs = [
    { id: "profile", label: "프로필", icon: User },
    { id: "donations", label: "기부내역", icon: Heart },
    { id: "settings", label: "설정", icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 overflow-y-auto">
        {/* 헤더 */}
        <MobileHeader title="마이페이지" />

        {/* 메인 콘텐츠 */}
        <main className="max-w-md mx-auto px-6 py-8 pb-20">
          {/* 비로그인 안내 */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo/말랑.png"
                alt="말랑이 로고"
                className="w-32 h-20 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-rose-900 mb-4">
              마이페이지
            </h2>
            <p className="text-rose-600 leading-relaxed mb-8">
              로그인하면 개인화된 기부 관리와<br />
              다양한 기능을 이용할 수 있어요.
            </p>
          </div>

          {/* 기능 소개 카드들 */}
          <div className="space-y-4 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/roulette/말랑캐릭터.png"
                    alt="말랑이 캐릭터"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-rose-900 mb-1">기부 내역 관리</h3>
                  <p className="text-sm text-rose-600">나의 기부 기록을 한눈에 확인하세요</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/roulette/말랑캐릭터.png"
                    alt="말랑이 캐릭터"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-rose-900 mb-1">기부 목표 설정</h3>
                  <p className="text-sm text-rose-600">나만의 기부 목표를 세우고 달성해보세요</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/roulette/말랑캐릭터.png"
                    alt="말랑이 캐릭터"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-rose-900 mb-1">개인화된 추천</h3>
                  <p className="text-sm text-rose-600">맞춤형 기부 기관을 추천받으세요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 로그인 버튼들 */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-center block hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg"
            >
              로그인하기
            </Link>
            
            <Link
              to="/register"
              className="w-full bg-rose-100 text-rose-700 py-3 rounded-xl font-medium border border-rose-300 hover:bg-rose-200 transition-colors text-center block"
            >
              회원가입
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 overflow-y-auto">
        <MobileHeader title="마이페이지" />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const displayUser = userProfile || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 overflow-y-auto">
      {/* 헤더 */}
      <MobileHeader title="마이페이지" />

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8 pb-20">
        {/* 사용자 프로필 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
              {displayUser.profileImage ? (
                <img
                  src={displayUser.profileImage}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-rose-900">{displayUser.name}</h2>
              <p className="text-rose-600">{displayUser.email}</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-rose-100 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? "bg-rose-500 text-white"
                      : "text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 mb-6">
          {activeTab === "profile" && (
            <div>
              <h3 className="text-lg font-bold text-rose-900 mb-4">프로필 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">이름</label>
                  <input
                    type="text"
                    value={displayUser.name}
                    className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">이메일</label>
                  <input
                    type="email"
                    value={displayUser.email}
                    className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                {displayUser.bio && (
                  <div>
                    <label className="block text-sm font-medium text-rose-700 mb-2">소개</label>
                    <textarea
                      value={displayUser.bio}
                      className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      readOnly
                      rows={3}
                    />
                  </div>
                )}
              </div>
              
              {/* 기부 통계 */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-rose-900 mb-4">기부 통계</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {donationStats.donationCount}
                    </div>
                    <div className="text-sm text-rose-500">기부 횟수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {donationStats.totalAmount.toLocaleString()}원
                    </div>
                    <div className="text-sm text-rose-500">총 기부금액</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {Math.round(donationStats.goalProgress)}%
                    </div>
                    <div className="text-sm text-rose-500">목표 달성률</div>
                  </div>
                </div>
                
                {/* 기부 목표 진행률 */}
                {displayUser.donationGoal > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-rose-600 mb-2">
                      <span>기부 목표</span>
                      <span>{donationStats.totalAmount.toLocaleString()}원 / {displayUser.donationGoal.toLocaleString()}원</span>
                    </div>
                    <div className="w-full bg-rose-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-rose-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(donationStats.goalProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 기부 내역 섹션 */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-rose-900 mb-4">최근 기부 내역</h3>
                {donationStats.donationCount > 0 ? (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-rose-300 mx-auto mb-4" />
                    <p className="text-rose-600 mb-4">최근 기부 내역이 있습니다.</p>
                    <Link
                      to="/donation-history"
                      className="inline-block bg-rose-500 text-white px-6 py-2 rounded-xl hover:bg-rose-600 transition-colors"
                    >
                      전체 내역 보기
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-rose-300 mx-auto mb-4" />
                    <p className="text-rose-600">아직 기부 내역이 없습니다.</p>
                    <Link
                      to="/"
                      className="inline-block mt-4 bg-rose-500 text-white px-6 py-2 rounded-xl hover:bg-rose-600 transition-colors"
                    >
                      기부하러 가기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div>
              <h3 className="text-lg font-bold text-rose-900 mb-4">기부 내역</h3>
              <div className="bg-rose-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <Heart size={48} className="text-rose-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-rose-900 mb-2">나의 기부 내역</h4>
                  <p className="text-rose-600 mb-4">나의 기부 내역을 확인하세요</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">{donationStats.donationCount}</div>
                      <div className="text-sm text-rose-500">총 기부횟수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">{donationStats.totalAmount.toLocaleString()}원</div>
                      <div className="text-sm text-rose-500">총 기부금액</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">{Math.round(donationStats.totalAmount * 0.15).toLocaleString()}원</div>
                      <div className="text-sm text-rose-500">세액공제액</div>
                    </div>
                  </div>
                  <Link
                    to="/receipts"
                    className="w-full inline-block bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors text-center"
                  >
                    영수증 다운로드
                  </Link>
                </div>
              </div>
              
              {/* 달력 컴포넌트 */}
              <div className="bg-white border border-rose-200 rounded-xl p-4">
                <div className="text-center py-8">
                  <Calendar size={32} className="text-rose-300 mx-auto mb-2" />
                  <p className="text-rose-600">달력 기능은 준비 중입니다</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MyPage;
