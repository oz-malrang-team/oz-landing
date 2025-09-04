import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Receipt,
  Calendar,
  Download,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Share2,
  Plus,
  Search,
  Filter,
  CreditCard,
  FileText,
  Moon,
  Sun,
  HelpCircle,
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  Camera,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Gift,
  Award,
  MessageSquare,
  Phone,
  Building2,
  Mail,
  User,
  Save,
  Edit3,
  Shield
} from 'lucide-react';

const MyPage = () => {
  // State 정의
  const [selectedTab, setSelectedTab] = useState('profile');
  const [donationHistory, setDonationHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '마음씨',
    email: 'maeum@malrang.com',
    phone: '010-1234-5678',
    profileImage: null,
    joinDate: '2024.01.15',
    bio: '따뜻한 마음으로 기부하는 분',
    donationGoal: 100000,
    isPublicProfile: true
  });
  const [notifications, setNotifications] = useState({
    donation: true,
    community: true,
    marketing: false,
    push: true,
    email: true,
    sms: false,
    night: false
  });
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showRecurringSettings, setShowRecurringSettings] = useState(false);
  const [showReceiptSettings, setShowReceiptSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [profileEditData, setProfileEditData] = useState({
    name: '',
    bio: '',
    profileImage: null
  });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', name: '신한카드 ****1234', isDefault: true },
    { id: 2, type: 'bank', name: '국민은행 ****5678', isDefault: false }
  ]);
  const [recurringDonations, setRecurringDonations] = useState([
    { id: 1, organization: '어린이병원', amount: 30000, frequency: 'monthly', nextDate: '2024-09-15', active: true },
    { id: 2, organization: '유기동물 보호소', amount: 20000, frequency: 'monthly', nextDate: '2024-09-10', active: false }
  ]);

  // 기부 내역 데이터 로드 (빈 배열로 초기화)
  useEffect(() => {
    const loadDonationHistory = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDonationHistory([]);
      } catch (err) {
        setError('기부 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadDonationHistory();
  }, []);

  // 유틸리티 함수
  const formatNumber = (num) => num.toLocaleString();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}.${day} ${hours}:${minutes}`;
  };
  const getTotalAmount = () => donationHistory.reduce((sum, item) => sum + item.amount, 0);
  const getGoalProgress = () => {
    const totalDonated = getTotalAmount();
    return userProfile.donationGoal > 0
      ? Math.min((totalDonated / userProfile.donationGoal) * 100, 100)
      : 0;
  };

  // 이벤트 핸들러
  const handleGoBack = () => window.history.back();
  const handleProfileUpdate = async (updatedProfile) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile({ ...userProfile, ...updatedProfile });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setShowSettings(false);
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (updatedNotifications) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications({ ...notifications, ...updatedNotifications });
      setSuccess('알림 설정이 저장되었습니다.');
      setShowNotificationSettings(false);
    } catch (err) {
      setError('알림 설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.new.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (receiptId) => {
    try {
      setSuccess('영수증 다운로드를 시작합니다.');
    } catch (err) {
      setError('영수증 다운로드에 실패했습니다.');
    }
  };

  const handleShareProfile = () => setShowShareModal(true);
  
  const handleSocialShare = (platform) => {
    const profileUrl = `${window.location.origin}/profile/${userProfile.email}`;
    const text = `${userProfile.name}님의 Malrang 기부 프로필을 확인해보세요!`;
    switch (platform) {
      case 'kakao':
        navigator.clipboard.writeText(`${text} ${profileUrl}`);
        setSuccess('카카오톡 공유용 텍스트가 클립보드에 복사되었습니다!');
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${text} ${profileUrl}`);
        setSuccess('인스타그램 공유용 텍스트가 클립보드에 복사되었습니다!');
        break;
      case 'copy':
        navigator.clipboard.writeText(profileUrl);
        setSuccess('프로필 링크가 클립보드에 복사되었습니다.');
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('로그아웃 되었습니다.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError('로그아웃에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '계정삭제') {
      setError('계정삭제를 정확히 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('계정이 삭제되었습니다.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError('계정 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecurring = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecurringDonations(recurringDonations.map(donation =>
        donation.id === id ? { ...donation, active: !donation.active } : donation
      ));
      setSuccess('정기기부 설정이 변경되었습니다.');
    } catch (err) {
      setError('정기기부 설정 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 편집 핸들러
  const handleProfileEdit = async () => {
    if (!profileEditData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile({ 
        ...userProfile, 
        name: profileEditData.name,
        bio: profileEditData.bio,
        profileImage: profileEditData.profileImage
      });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setShowProfileEdit(false);
      setProfileEditData({ name: '', bio: '', profileImage: null });
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileEditData({ ...profileEditData, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openProfileEdit = () => {
    setProfileEditData({
      name: userProfile.name,
      bio: userProfile.bio,
      profileImage: userProfile.profileImage
    });
    setShowProfileEdit(true);
  };

  // 알림 메시지 컴포넌트
  const AlertMessage = () => {
    if (!error && !success) return null;
    return (
      <div className="fixed top-4 left-4 right-4 z-50">
        <div className={`p-4 rounded-xl shadow-lg border ${
          error
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <div className="flex items-center gap-3">
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="flex-1">{error || success}</span>
            <button
              onClick={() => {
                setError('');
                setSuccess('');
              }}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 기부 내역 모달 컴포넌트
  const DonationHistoryModal = () => {
    if (!showDonationHistory) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">기부 내역</h2>
              <button
                onClick={() => setShowDonationHistory(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                <p className="text-rose-600 mt-2">로딩 중...</p>
              </div>
            ) : donationHistory.length === 0 ? (
              <div className="text-center py-8">
                <Receipt size={48} className="mx-auto text-rose-300 mb-4" />
                <p className="text-rose-600 mb-2">아직 기부 내역이 없습니다</p>
                <p className="text-rose-500 text-sm">
                  첫 기부를 시작해보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {donationHistory.map((item, index) => (
                  <div key={index} className="bg-rose-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-rose-900">{item.organization}</h4>
                        <p className="text-sm text-rose-600">{formatDate(item.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-900">{formatNumber(item.amount)}원</p>
                        <button
                          onClick={() => handleDownloadReceipt(item.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-1"
                        >
                          <Download size={12} />
                          영수증
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 설정 모달 컴포넌트
  const SettingsModal = () => {
    if (!showSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-rose-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">설정</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <button
              onClick={() => setShowNotificationSettings(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-rose-600" />
                <span className="text-rose-900">알림 설정</span>
              </div>
              <ChevronRight size={16} className="text-rose-600" />
            </button>
            
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-rose-600" />
                <span className="text-rose-900">비밀번호 변경</span>
              </div>
              <ChevronRight size={16} className="text-rose-600" />
            </button>
            
            <button
              onClick={() => setShowPaymentSettings(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-rose-600" />
                <span className="text-rose-900">결제 수단 관리</span>
              </div>
              <ChevronRight size={16} className="text-rose-600" />
            </button>
            
            <button
              onClick={() => setShowRecurringSettings(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-rose-600" />
                <span className="text-rose-900">정기기부 관리</span>
              </div>
              <ChevronRight size={16} className="text-rose-600" />
            </button>
            
            <button
              onClick={() => setShowReceiptSettings(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-rose-600" />
                <span className="text-rose-900">영수증 설정</span>
              </div>
              <ChevronRight size={16} className="text-rose-600" />
            </button>
            
            {/* 이용안내 섹션 */}
            <div className="border-t border-rose-200 pt-4">
              <h3 className="text-sm font-medium text-rose-700 mb-3">이용안내</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowTerms(true)}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-rose-600" />
                    <span className="text-rose-900">이용약관</span>
                  </div>
                  <ChevronRight size={16} className="text-rose-600" />
                </button>
                
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-rose-600" />
                    <span className="text-rose-900">개인정보처리방침</span>
                  </div>
                  <ChevronRight size={16} className="text-rose-600" />
                </button>
                
                <button
                  onClick={() => setShowCustomerService(true)}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-rose-600" />
                    <span className="text-rose-900">고객센터</span>
                  </div>
                  <ChevronRight size={16} className="text-rose-600" />
                </button>
              </div>
            </div>
          </div>
          
          {/* 하단 계정 관리 섹션 */}
          <div className="border-t border-rose-200 p-6 bg-rose-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                로그아웃
              </button>
              
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowDeleteAccount(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 이용약관 모달 컴포넌트
  const TermsModal = () => {
    if (!showTerms) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">이용약관</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="space-y-4 text-sm text-rose-800">
              <div>
                <h3 className="font-bold text-rose-900 mb-2">제1조 (목적)</h3>
                <p>본 약관은 Malrang 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">제2조 (정의)</h3>
                <p>1. "서비스"란 기부 플랫폼을 통해 기부자와 수혜자를 연결하는 온라인 서비스를 의미합니다.</p>
                <p>2. "이용자"란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">제3조 (약관의 효력 및 변경)</h3>
                <p>1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</p>
                <p>2. 회사는 합리적인 사유가 발생할 경우에는 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의 내용과 시행일을 정하여 시행일로부터 최소 7일 이전에 공지합니다.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">제4조 (서비스의 제공)</h3>
                <p>1. 회사는 다음과 같은 업무를 수행합니다:</p>
                <p className="ml-4">- 기부 플랫폼 서비스 제공</p>
                <p className="ml-4">- 기부금 관리 및 전달</p>
                <p className="ml-4">- 기부 내역 관리</p>
                <p className="ml-4">- 기타 관련 서비스</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">제5조 (서비스의 중단)</h3>
                <p>1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
                <p>2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</p>
              </div>
              
              <div className="text-center py-4">
                <p className="text-xs text-rose-500">
                  시행일: 2024년 1월 1일<br/>
                  최종 수정일: 2024년 1월 1일
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 개인정보처리방침 모달 컴포넌트
  const PrivacyModal = () => {
    if (!showPrivacy) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">개인정보처리방침</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="space-y-4 text-sm text-rose-800">
              <div>
                <h3 className="font-bold text-rose-900 mb-2">1. 개인정보의 처리목적</h3>
                <p>Malrang은 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <p className="ml-4">- 회원 가입 및 관리</p>
                <p className="ml-4">- 기부 서비스 제공</p>
                <p className="ml-4">- 기부금 처리 및 관리</p>
                <p className="ml-4">- 고객 상담 및 문의 처리</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">2. 개인정보의 처리 및 보유기간</h3>
                <p>1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                <p className="ml-4">- 회원 정보: 회원 탈퇴시까지</p>
                <p className="ml-4">- 기부 내역: 5년간 보관</p>
                <p className="ml-4">- 결제 정보: 관련 법령에 따라 보관</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">3. 처리하는 개인정보의 항목</h3>
                <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                <p className="ml-4">- 필수항목: 이름, 이메일, 전화번호</p>
                <p className="ml-4">- 선택항목: 프로필 사진, 자기소개</p>
                <p className="ml-4">- 자동수집항목: IP주소, 쿠키, 서비스 이용기록</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">4. 개인정보의 제3자 제공</h3>
                <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-rose-900 mb-2">5. 개인정보의 안전성 확보조치</h3>
                <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <p className="ml-4">- 관리적 조치: 내부관리계획 수립, 전담조직 운영</p>
                <p className="ml-4">- 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치</p>
                <p className="ml-4">- 물리적 조치: 전산실, 자료보관실 등의 접근통제</p>
              </div>
              
              <div className="text-center py-4">
                <p className="text-xs text-rose-500">
                  시행일: 2024년 1월 1일<br/>
                  최종 수정일: 2024년 1월 1일
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 고객센터 모달 컴포넌트
  const CustomerServiceModal = () => {
    if (!showCustomerService) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-rose-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">고객센터</h2>
              <button
                onClick={() => setShowCustomerService(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 연락처 정보 */}
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-rose-500 mb-4" />
              <h3 className="font-bold text-rose-900 mb-2">문의하기</h3>
              <p className="text-rose-600 text-sm mb-4">
                궁금한 점이 있으시면 언제든지 연락주세요
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-rose-600" />
                  <span className="font-medium text-rose-900">이메일 문의</span>
                </div>
                <p className="text-rose-600 text-sm mb-2">support@malrang.com</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('support@malrang.com');
                    setSuccess('이메일 주소가 클립보드에 복사되었습니다.');
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                >
                  <Copy size={12} />
                  복사하기
                </button>
              </div>
              
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-rose-600" />
                  <span className="font-medium text-rose-900">전화 문의</span>
                </div>
                <p className="text-rose-600 text-sm mb-2">1588-0000</p>
                <p className="text-xs text-rose-500">평일 09:00 - 18:00 (주말, 공휴일 휴무)</p>
              </div>
              
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 size={20} className="text-rose-600" />
                  <span className="font-medium text-rose-900">사무실 주소</span>
                </div>
                <p className="text-rose-600 text-sm">서울특별시 강남구 테헤란로 123</p>
                <p className="text-xs text-rose-500">Malrang 빌딩 10층</p>
              </div>
            </div>
            
            {/* 자주 묻는 질문 */}
            <div>
              <h4 className="font-bold text-rose-900 mb-3">자주 묻는 질문</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">기부는 어떻게 하나요?</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">영수증은 언제 발급되나요?</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">정기기부를 중단하고 싶어요</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">비밀번호를 잊어버렸어요</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">기부금은 어떻게 사용되나요?</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">환불은 가능한가요?</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">개인정보는 안전한가요?</p>
                </button>
                <button className="w-full text-left p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                  <p className="text-sm font-medium text-rose-900">앱 사용법을 알고 싶어요</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 공유 모달 컴포넌트
  const ShareModal = () => {
    if (!showShareModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">프로필 공유</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                😊
              </div>
              <h3 className="font-bold text-rose-900 mb-1">{userProfile.name}님의 기부 프로필</h3>
              <p className="text-rose-600 text-sm">따뜻한 마음으로 기부하는 분</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleSocialShare('kakao')}
                className="w-full flex items-center gap-3 p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">K</span>
                </div>
                <span className="text-yellow-900">카카오톡으로 공유</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('instagram')}
                className="w-full flex items-center gap-3 p-4 bg-pink-100 rounded-xl hover:bg-pink-200 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IG</span>
                </div>
                <span className="text-pink-900">인스타그램으로 공유</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('copy')}
                className="w-full flex items-center gap-3 p-4 bg-rose-100 rounded-xl hover:bg-rose-200 transition-colors"
              >
                <Copy size={20} className="text-rose-600" />
                <span className="text-rose-900">링크 복사</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 알림 설정 모달 컴포넌트
  const NotificationSettingsModal = () => {
    if (!showNotificationSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">알림 설정</h2>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">기부 알림</h4>
                  <p className="text-sm text-rose-600">기부 관련 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ donation: !notifications.donation })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.donation ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.donation ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">커뮤니티 알림</h4>
                  <p className="text-sm text-rose-600">커뮤니티 활동 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ community: !notifications.community })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.community ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.community ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">마케팅 알림</h4>
                  <p className="text-sm text-rose-600">이벤트 및 프로모션 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ marketing: !notifications.marketing })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.marketing ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.marketing ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">푸시 알림</h4>
                  <p className="text-sm text-rose-600">앱 푸시 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ push: !notifications.push })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.push ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">이메일 알림</h4>
                  <p className="text-sm text-rose-600">이메일로 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ email: !notifications.email })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.email ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">SMS 알림</h4>
                  <p className="text-sm text-rose-600">문자로 알림을 받습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ sms: !notifications.sms })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.sms ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-900">야간 알림 방지</h4>
                  <p className="text-sm text-rose-600">22:00 - 08:00 알림을 받지 않습니다</p>
                </div>
                <button
                  onClick={() => handleNotificationUpdate({ night: !notifications.night })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.night ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.night ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 비밀번호 변경 모달 컴포넌트
  const PasswordChangeModal = () => {
    if (!showPasswordChange) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">비밀번호 변경</h2>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">현재 비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="현재 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">새 비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">새 비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handlePasswordChange}
              disabled={loading || !passwordData.current || !passwordData.new || !passwordData.confirm}
              className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 결제 수단 관리 모달 컴포넌트
  const PaymentSettingsModal = () => {
    if (!showPaymentSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">결제 수단 관리</h2>
              <button
                onClick={() => setShowPaymentSettings(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="bg-rose-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-rose-600" />
                      <div>
                        <p className="font-medium text-rose-900">{method.name}</p>
                        {method.isDefault && (
                          <p className="text-xs text-rose-600">기본 결제 수단</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <button className="text-xs text-rose-600 hover:text-rose-700">
                          기본 설정
                        </button>
                      )}
                      <button className="text-xs text-red-600 hover:text-red-700">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} />
              새 결제 수단 추가
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 정기기부 관리 모달 컴포넌트
  const RecurringSettingsModal = () => {
    if (!showRecurringSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">정기기부 관리</h2>
              <button
                onClick={() => setShowRecurringSettings(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {recurringDonations.map((donation) => (
                <div key={donation.id} className="bg-rose-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-rose-900">{donation.organization}</h4>
                      <p className="text-sm text-rose-600">
                        {formatNumber(donation.amount)}원 · {donation.frequency === 'monthly' ? '매월' : '매주'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleRecurring(donation.id)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        donation.active ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        donation.active ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-rose-500">
                    다음 기부일: {donation.nextDate}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} />
              새 정기기부 설정
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 영수증 설정 모달 컴포넌트
  const ReceiptSettingsModal = () => {
    if (!showReceiptSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">영수증 설정</h2>
              <button
                onClick={() => setShowReceiptSettings(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-rose-300 mb-4" />
              <h3 className="font-bold text-rose-900 mb-2">영수증 설정</h3>
              <p className="text-rose-600 text-sm mb-4">
                기부 영수증 발급 및 관리 설정을 할 수 있습니다
              </p>
              <button className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors">
                영수증 설정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 계정 삭제 모달 컴포넌트
  const DeleteAccountModal = () => {
    if (!showDeleteAccount) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-red-900">계정 삭제</h2>
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <X size={20} className="text-red-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="text-center mb-6">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="font-bold text-red-900 mb-2">계정을 삭제하시겠습니까?</h3>
              <p className="text-red-600 text-sm">
                이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-900 mb-2">
                확인을 위해 "계정삭제"를 입력하세요
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full p-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="계정삭제"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="flex-1 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== '계정삭제'}
                className="flex-1 p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '삭제 중...' : '계정 삭제'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 프로필 편집 모달 컴포넌트
  const ProfileEditModal = () => {
    if (!showProfileEdit) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6 border-b border-rose-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-900">프로필 편집</h2>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* 프로필 사진 */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 overflow-hidden">
                  {profileEditData.profileImage ? (
                    <img 
                      src={profileEditData.profileImage} 
                      alt="프로필" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '😊'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:bg-rose-600 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-rose-600">프로필 사진을 변경하려면 카메라 아이콘을 클릭하세요</p>
            </div>
            
            {/* 이름 입력 */}
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">이름</label>
              <input
                type="text"
                value={profileEditData.name}
                onChange={(e) => setProfileEditData({ ...profileEditData, name: e.target.value })}
                className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="이름을 입력하세요"
                maxLength={20}
              />
            </div>
            
            {/* 자기소개 입력 */}
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">자기소개</label>
              <textarea
                value={profileEditData.bio}
                onChange={(e) => setProfileEditData({ ...profileEditData, bio: e.target.value })}
                className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                placeholder="자기소개를 입력하세요"
                rows={3}
                maxLength={100}
              />
              <p className="text-xs text-rose-500 mt-1">
                {profileEditData.bio.length}/100
              </p>
            </div>
            
            {/* 저장 버튼 */}
            <button
              onClick={handleProfileEdit}
              disabled={loading || !profileEditData.name.trim()}
              className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : '프로필 저장'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 실제 화면 렌더링
  return (
    <div className="min-h-screen bg-rose-50">
      <AlertMessage />
      
      {/* 헤더 */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-rose-200">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            title="뒤로가기"
          >
            <ArrowLeft size={20} className="text-rose-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-rose-900">Malrang</h1>
            <p className="text-sm text-rose-600">나의 기부 활동을 확인해보세요</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            title="설정"
          >
            <Settings size={20} className="text-rose-600" />
          </button>
        </div>
      </div>

      <div className="pb-6">
        {/* 프로필 섹션 */}
        <div className="bg-white p-6 m-5 rounded-3xl shadow-lg border border-rose-200">
          <div className="flex gap-4 mb-6">
            {/* 프로필 부분 - 크기 줄이고 왼쪽 배치 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-lg overflow-hidden">
                {userProfile.profileImage ? (
                  <img 
                    src={userProfile.profileImage} 
                    alt="프로필" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '😊'
                )}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-rose-900 mb-1">{userProfile.name}</h2>
              <p className="text-rose-600 text-sm mb-2">{userProfile.bio}</p>
              <div className="text-sm">
                <div className="bg-rose-50 rounded-lg p-2 inline-block">
                  <p className="text-rose-600 text-xs">총 기부</p>
                  <p className="font-bold text-rose-900">{formatNumber(getTotalAmount())}원</p>
                </div>
              </div>
            </div>
            {/* 편집 버튼과 기부 내역 버튼 - 우측 배치 */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              <button
                onClick={openProfileEdit}
                className="bg-rose-100 text-rose-700 px-4 py-2 rounded-xl text-sm hover:bg-rose-200 transition-colors flex items-center gap-2"
              >
                <Edit3 size={16} />
                편집
              </button>
              <button
                onClick={() => setShowDonationHistory(true)}
                className="bg-rose-100 text-rose-700 px-4 py-2 rounded-xl text-sm hover:bg-rose-200 transition-colors flex items-center gap-2"
              >
                <Receipt size={16} />
                기부내역
              </button>
            </div>
          </div>

          {/* 기부 목표 진행률 */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-rose-700 mb-2">
              <span>연간 목표</span>
              <span>{Math.round(getGoalProgress())}%</span>
            </div>
            <div className="w-full bg-rose-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getGoalProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleShareProfile}
              className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm hover:bg-rose-200 transition-colors border border-rose-200"
            >
              <Share2 size={14} className="inline mr-1" />
              공유
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-5 mb-6">
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-rose-200 shadow-sm">
            {[
              { id: 'profile', label: '프로필', icon: User },
              { id: 'calendar', label: '연말정산', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
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

        {/* 탭별 내용 */}
        {selectedTab === 'profile' && (
          <div className="px-5 space-y-6">
            {/* 개인 정보 */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
              <h3 className="text-lg font-bold text-rose-900 mb-4">개인 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-rose-600" />
                  <div>
                    <p className="text-sm text-rose-600">이름</p>
                    <p className="font-medium text-rose-900">{userProfile.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-rose-600" />
                  <div>
                    <p className="text-sm text-rose-600">이메일</p>
                    <p className="font-medium text-rose-900">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-rose-600" />
                  <div>
                    <p className="text-sm text-rose-600">전화번호</p>
                    <p className="font-medium text-rose-900">{userProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-rose-600" />
                  <div>
                    <p className="text-sm text-rose-600">가입일</p>
                    <p className="font-medium text-rose-900">{userProfile.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 연말정산 탭 */}
        {selectedTab === 'calendar' && (
          <div className="px-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
              <div className="text-center mb-6">
                <Calendar size={48} className="mx-auto text-rose-500 mb-4" />
                <h3 className="text-lg font-bold text-rose-900 mb-2">2024년 기부 현황</h3>
                <p className="text-rose-600 text-sm mb-4">
                  연말정산을 위한 기부금 내역을 확인하세요
                </p>
              </div>

              {/* 연간 요약 */}
              <div className="bg-rose-50 rounded-2xl p-4 mb-6">
                <h4 className="font-bold text-rose-900 mb-3 text-center">2024년 기부 요약</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {formatNumber(getTotalAmount())}원
                    </div>
                    <div className="text-sm text-rose-500">총 기부 금액</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {donationHistory.length}회
                    </div>
                    <div className="text-sm text-rose-500">총 기부 횟수</div>
                  </div>
                </div>
              </div>

              {/* 월별 현황 안내 */}
              {donationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-rose-300 mb-4" />
                  <p className="text-rose-600 mb-2">아직 기부 내역이 없습니다</p>
                  <p className="text-rose-500 text-sm mb-4">
                    기부를 시작하면 연말정산용 데이터를 자동으로 관리해드립니다
                  </p>
                  <button className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors">
                    첫 기부 시작하기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const monthData = donationHistory.filter(item => {
                      const itemDate = new Date(item.date);
                      return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === 2024;
                    });
                    const amount = monthData.reduce((sum, item) => sum + item.amount, 0);
                    const count = monthData.length;
                    return (
                      <div key={month} className="bg-rose-50 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold mb-2 text-rose-900">{month}월</div>
                        <div className="text-lg font-bold text-rose-600 mb-1">
                          {amount > 0 ? formatNumber(amount) + '원' : '0원'}
                        </div>
                        <div className="text-sm text-rose-500">
                          {count}회 기부
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    if (donationHistory.length === 0) {
                      setError('다운로드할 기부 내역이 없습니다.');
                    } else {
                      setSuccess('연말정산용 데이터가 다운로드되었습니다.');
                    }
                  }}
                  disabled={donationHistory.length === 0}
                  className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={20} className="inline mr-2" />
                  연말정산용 데이터 다운로드
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      {showDonationHistory && <DonationHistoryModal />}
      {showSettings && <SettingsModal />}
      {showShareModal && <ShareModal />}
      {showProfileEdit && <ProfileEditModal />}
      {showNotificationSettings && <NotificationSettingsModal />}
      {showPasswordChange && <PasswordChangeModal />}
      {showPaymentSettings && <PaymentSettingsModal />}
      {showRecurringSettings && <RecurringSettingsModal />}
      {showReceiptSettings && <ReceiptSettingsModal />}
      {showTerms && <TermsModal />}
      {showPrivacy && <PrivacyModal />}
      {showCustomerService && <CustomerServiceModal />}
      {showDeleteAccount && <DeleteAccountModal />}

      {/* 하단 여백 */}
      <div className="h-20"></div>
    </div>
  );
};

// named export와 default export 모두 제공
export { MyPage };
export default MyPage;