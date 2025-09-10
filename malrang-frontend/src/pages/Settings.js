import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Target, 
  Eye, 
  EyeOff, 
  Trash2, 
  X,
  CreditCard,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  Building2,
  Mail,
  Copy,
  ChevronRight,
  Plus,
  Shield,
  LogOut,
  Camera,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout, user, updateUser, fetchUserProfile } = useAuth();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 수정 폼
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    donationGoal: 100000,
    profileImage: null
  });

  // 비밀번호 변경 폼
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 모달 상태
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showRecurringSettings, setShowRecurringSettings] = useState(false);
  const [showReceiptSettings, setShowReceiptSettings] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);

  // 계정 삭제 확인
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // 결제 수단 및 정기기부 데이터
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [recurringDonations, setRecurringDonations] = useState([]);

  // 인증 검사 활성화
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // 사용자 데이터 로드
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadPaymentMethods();
      loadRecurringDonations();
    }
  }, [user]);

  // user 상태 변경 시 profileForm 즉시 업데이트
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        donationGoal: user.donationGoal || 100000,
        profileImage: user.profileImage || null
      });
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        const userData = response.data.data.user;
        setProfileForm({
          name: userData.name || '',
          bio: userData.bio || '',
          donationGoal: userData.donationGoal || 100000,
          profileImage: userData.profileImage || null
        });
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      setError('프로필 정보를 불러오는데 실패했습니다.');
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await api.get('/user/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.data.paymentMethods);
      }
    } catch (error) {
      console.error('결제 수단 로드 오류:', error);
    }
  };

  const loadRecurringDonations = async () => {
    try {
      const response = await api.get('/user/recurring-donations');
      if (response.data.success) {
        setRecurringDonations(response.data.data.recurringDonations);
      }
    } catch (error) {
      console.error('정기기부 로드 오류:', error);
    }
  };

  const formatNumber = (num) => num.toLocaleString();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.put('/user/profile', profileForm);
      if (response.data.success) {
        setSuccess('프로필이 성공적으로 업데이트되었습니다.');
        // 전역 user 상태 업데이트
        const updatedUser = response.data.data.user;
        updateUser(updatedUser);
        fetchUserProfile(); // 프로필 업데이트 후 사용자 정보 다시 로드
      }
    } catch (error) {
      setError(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.put('/user/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.success) {
        setSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (deleteConfirmText !== '계정삭제') {
      setError('확인 텍스트를 정확히 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.delete('/user/account', {
        data: { confirmText: deleteConfirmText }
      });
      
      if (response.data.success) {
        setSuccess('계정이 성공적으로 삭제되었습니다. 이용해주셔서 감사합니다.');
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || '계정 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm({ ...profileForm, profileImage: e.target.result });
        setSuccess('프로필 이미지가 업데이트되었습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleRecurring = async (id) => {
    try {
      const response = await api.put(`/user/recurring-donations/${id}/toggle`);
      if (response.data.success) {
        setRecurringDonations(recurringDonations.map(donation =>
          donation.id === id ? { ...donation, active: !donation.active } : donation
        ));
        setSuccess('정기기부 설정이 변경되었습니다.');
      }
    } catch (error) {
      setError('정기기부 설정 변경에 실패했습니다.');
    }
  };

  // 알림 메시지 컴포넌트
  const AlertMessageComponent = () => {
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

  // 비밀번호 변경 모달
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
          
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">현재 비밀번호</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">새 비밀번호</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                  minLength="8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-900 mb-2">새 비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // 결제 수단 관리 모달
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
                        <button 
                          onClick={() => setSuccess('기본 결제 수단으로 설정되었습니다. (데모)')}
                          className="text-xs text-rose-600 hover:text-rose-700"
                        >
                          기본 설정
                        </button>
                      )}
                      <button 
                        onClick={() => setSuccess('결제 수단이 삭제되었습니다. (데모)')}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setSuccess('새 결제 수단이 추가되었습니다. (데모)')}
              className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              새 결제 수단 추가
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 정기기부 관리 모달
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
            
            <button 
              onClick={() => setSuccess('새 정기기부가 설정되었습니다. (데모)')}
              className="w-full p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              새 정기기부 설정
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 영수증 설정 모달
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
              <button 
                onClick={() => setSuccess('영수증 설정이 완료되었습니다. (데모)')}
                className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
              >
                영수증 설정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 이용약관 모달
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
              
              <div className="text-center py-4">
                <p className="text-xs text-rose-500">
                  시행일: 2025년 9월 9일<br/>
                  최종 수정일: 2025년 9월 9일
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 개인정보처리방침 모달
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
              
              <div className="text-center py-4">
                <p className="text-xs text-rose-500">
                  시행일: 2025년 9월 9일<br/>
                  최종 수정일: 2025년 9월 9일
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 고객센터 모달
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
              <div className="space-y-3">
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="font-medium text-rose-800 text-sm mb-2">Q. 기부금 영수증은 어떻게 발급받을 수 있나요?</p>
                  <p className="text-rose-600 text-xs">A. 기부금 영수증은 마이페이지의 '기부 내역'에서 직접 발급받으실 수 있습니다. 연말정산 시 필요한 기부금 영수증은 국세청 연말정산 간소화 서비스에 자동 등록됩니다.</p>
                </div>
                
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="font-medium text-rose-800 text-sm mb-2">Q. 정기후원 금액을 변경하거나 중단하고 싶어요.</p>
                  <p className="text-rose-600 text-xs">A. 정기후원 금액 변경 및 중단은 마이페이지의 '정기후원 관리' 메뉴에서 직접 신청하실 수 있습니다. 후원금 변경은 다음 결제일로부터, 중단은 신청 즉시 반영됩니다.</p>
                </div>
                
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="font-medium text-rose-800 text-sm mb-2">Q. '나눔가게'에서 물품을 판매하고 싶어요.</p>
                  <p className="text-rose-600 text-xs">A. 나눔가게는 개인 간의 물품 나눔과 거래를 지원하는 커뮤니티 공간입니다. '커뮤니티' 페이지에서 '글쓰기' 버튼을 누른 후, 글쓰기 유형을 '나눔가게'로 선택해 주세요.</p>
                </div>
                
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="font-medium text-rose-800 text-sm mb-2">Q. 후원한 기부금이 어떻게 사용되는지 궁금해요.</p>
                  <p className="text-rose-600 text-xs">A. Malrang은 투명한 기부금 운영을 최우선으로 생각합니다. 후원하신 기부금의 사용 내역은 각 캠페인의 '임팩트 리포트'에서 자세히 확인하실 수 있습니다.</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowCustomerService(false);
                    navigate('/support');
                  }}
                  className="w-full mt-3 text-rose-600 text-sm hover:text-rose-700 underline"
                >
                  더 많은 FAQ 보기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <AlertMessageComponent />

      {/* 헤더 */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-rose-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/mypage')}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-rose-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-rose-900">설정</h1>
            <p className="text-sm text-rose-600">계정 및 서비스 설정</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 프로필 수정 섹션 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
            <User size={20} />
            프로필 정보
          </h3>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* 프로필 이미지 */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 overflow-hidden">
                  {profileForm.profileImage ? (
                    <img 
                      src={profileForm.profileImage} 
                      alt="프로필" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0) || '😊'}
                    </span>
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

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">이름</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">소개</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="자신을 소개해보세요..."
                maxLength="100"
              />
              <p className="text-xs text-rose-500 mt-1">
                {profileForm.bio.length}/100
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2 flex items-center gap-1">
                <Target size={16} />
                연간 기부 목표 (원)
              </label>
              <input
                type="number"
                value={profileForm.donationGoal}
                onChange={(e) => setProfileForm(prev => ({ ...prev, donationGoal: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                min="0"
                step="10000"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '프로필 저장'}
            </button>
          </form>
        </div>

        {/* 계정 관리 섹션 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4">계정 관리</h3>
          
          <div className="space-y-3">
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
          </div>
        </div>

        {/* 기부 관리 섹션 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4">기부 관리</h3>
          
          <div className="space-y-3">
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
          </div>
        </div>

        {/* 이용안내 섹션 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4">이용안내</h3>
          
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
              onClick={() => navigate('/support')}
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

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full bg-white text-rose-600 py-3 rounded-xl font-medium border border-rose-200 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          로그아웃
        </button>

        {/* 계정 삭제 섹션 */}
        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
          <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
            <Trash2 size={20} />
            계정 삭제
          </h3>
          
          {!showDeleteConfirm ? (
            <div>
              <p className="text-red-600 text-sm mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                계정 삭제하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
                  className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="계정삭제"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAccountDelete}
                  disabled={isLoading || deleteConfirmText !== '계정삭제'}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? '삭제 중...' : '삭제 확인'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모달들 */}
      {showPasswordChange && <PasswordChangeModal />}
      {showPaymentSettings && <PaymentSettingsModal />}
      {showRecurringSettings && <RecurringSettingsModal />}
      {showReceiptSettings && <ReceiptSettingsModal />}
      {showTerms && <TermsModal />}
      {showPrivacy && <PrivacyModal />}
      {showCustomerService && <CustomerServiceModal />}
    </div>
  );
};

export default Settings; 