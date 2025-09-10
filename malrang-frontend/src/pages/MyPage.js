import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import ProfileSection from '../components/mypage/ProfileSection';
import TabNavigation from '../components/mypage/TabNavigation';
import ProfileTab from '../components/mypage/ProfileTab';
import YearEndTab from '../components/mypage/YearEndTab';
import ShareModal from '../components/modals/ShareModal';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, logout, user } = useAuth();

  const [selectedTab, setSelectedTab] = useState('profile');
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 실제 데이터 상태
  const [userProfile, setUserProfile] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [stats, setStats] = useState({ totalAmount: 0, donationCount: 0, goalProgress: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  // 인증 검사 활성화
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // 사용자 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user) {
        loadUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, user]);

  // 페이지 이동 시 데이터 새로고침
  useEffect(() => {
    if (isAuthenticated && user && location.pathname === '/mypage') {
      loadUserData();
    }
  }, [location.pathname, isAuthenticated, user]);

  // user 상태 변경 시 userProfile 즉시 업데이트
  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setDataLoading(true);
      
      // 사용자 프로필과 통계 가져오기
      const profileResponse = await api.get('/user/profile');
      if (profileResponse.data.success) {
        setUserProfile(profileResponse.data.data.user);
        setStats(profileResponse.data.data.stats);
      }

      // 기부 내역 가져오기
      const donationsResponse = await api.get('/donations');
      if (donationsResponse.data.success) {
        setDonationHistory(donationsResponse.data.data.donations);
      }

    } catch (error) {
      console.error('데이터 로드 오류:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleShare = async (platform) => {
    setShowShareModal(false);
    const shareUrl = `${window.location.origin}/profile/${user?.id}`;
    const shareText = `${userProfile?.name}님의 프로필을 확인해보세요!`;
    
    try {
      switch (platform) {
        case 'kakao':
          if (window.Kakao && window.Kakao.Share) {
            window.Kakao.Share.sendDefault({
              objectType: 'feed',
              content: {
                title: '말랑 프로필',
                description: shareText,
                imageUrl: userProfile?.profileImage || '/default-profile.png',
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl
                }
              }
            });
            setSuccess('카카오톡으로 공유했습니다!');
          } else {
            await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            setSuccess('카카오톡 공유용 링크가 복사되었습니다!');
          }
          break;
        case 'instagram':
          await navigator.clipboard.writeText(shareUrl);
          setSuccess('인스타그램 공유용 링크가 복사되었습니다!');
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          setSuccess('프로필 링크가 복사되었습니다!');
          break;
        default:
          break;
      }
    } catch (error) {
      setError('공유 기능을 사용할 수 없습니다.');
    }
  };

  const handleYearEndDownload = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await api.get(`/donations/yearly-stats/${currentYear}`, {
        responseType: 'blob'
      });
      
      // Excel 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `연말정산_${currentYear}_${user?.name || 'user'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess('연말정산용 데이터를 다운로드했습니다!');
    } catch (error) {
      setError('연말정산 데이터 다운로드에 실패했습니다.');
    }
  };

  // 데모 모드에서는 설정 페이지에서 로그아웃 처리

  // 로딩 상태
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return null;
  }

  // 데이터가 로드되지 않은 경우
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600 mb-4">사용자 정보를 불러올 수 없습니다.</p>
          <button
            onClick={loadUserData}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <AlertMessage 
        error={error} 
        success={success} 
        onClose={() => {
          setError('');
          setSuccess('');
        }} 
      />

      <Header 
        title="마이페이지" 
        subtitle="프로필 정보를 확인하세요"
        onBack={handleBack}
        onSettings={handleSettings}
      />

      <ProfileSection 
        userProfile={userProfile}
        onShareProfile={() => setShowShareModal(true)}
      />

      <TabNavigation 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {selectedTab === 'profile' && (
        <ProfileTab userProfile={userProfile} />
      )}

      {selectedTab === 'calendar' && (
        <YearEndTab 
          donationHistory={donationHistory}
          totalAmount={stats.totalAmount}
          onDownload={handleYearEndDownload}
          onError={setError}
        />
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default MyPage; 