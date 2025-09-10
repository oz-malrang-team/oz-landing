import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Heart, CreditCard, Building, MessageCircle } from 'lucide-react';
import api from '../services/api';

const Donate = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [donationForm, setDonationForm] = useState({
    organization: '',
    amount: '',
    category: 'general',
    message: ''
  });

  const categories = [
    { value: 'general', label: '일반 기부' },
    { value: 'children', label: '아동 지원' },
    { value: 'elderly', label: '노인 복지' },
    { value: 'animal', label: '동물 보호' },
    { value: 'environment', label: '환경 보호' },
    { value: 'disaster', label: '재해 구호' }
  ];

  const quickAmounts = [10000, 30000, 50000, 100000, 300000, 500000];

  // 인증 검사 활성화
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleAmountClick = (amount) => {
    setDonationForm(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donationForm.organization.trim()) {
      setError('기부 단체를 입력해주세요.');
      return;
    }

    const amount = parseInt(donationForm.amount);
    if (!amount || amount < 1000) {
      setError('기부 금액은 최소 1,000원 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/donations', {
        organization: donationForm.organization.trim(),
        amount: amount,
        category: donationForm.category,
        message: donationForm.message.trim()
      });
      
      if (response.data.success) {
        setSuccess('기부가 성공적으로 완료되었습니다!');
        setDonationForm({
          organization: '',
          amount: '',
          category: 'general',
          message: ''
        });
        
        // 3초 후 마이페이지로 이동
        setTimeout(() => {
          navigate('/mypage');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || '기부 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
      <AlertMessage 
        error={error} 
        success={success} 
        onClose={() => {
          setError('');
          setSuccess('');
        }} 
      />

      <Header 
        title="기부하기" 
        subtitle="따뜻한 마음을 전해보세요"
        onBack={() => navigate('/')}
        showSettings={false}
      />

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기부 단체 */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
            <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
              <Building size={20} />
              기부 단체
            </h3>
            <input
              type="text"
              value={donationForm.organization}
              onChange={(e) => setDonationForm(prev => ({ ...prev, organization: e.target.value }))}
              className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="예: 유니세프, 월드비전, 굿네이버스 등"
              required
            />
          </div>

          {/* 기부 분야 */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
            <h3 className="text-lg font-bold text-rose-900 mb-4">기부 분야</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    donationForm.category === category.value
                      ? 'bg-rose-100 border-rose-300 text-rose-700'
                      : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={donationForm.category === category.value}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, category: e.target.value }))}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 기부 금액 */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
            <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
              <Heart size={20} />
              기부 금액
            </h3>
            
            {/* 빠른 선택 버튼 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountClick(amount)}
                  className={`p-3 rounded-xl border transition-colors text-sm font-medium ${
                    donationForm.amount === amount.toString()
                      ? 'bg-rose-100 border-rose-300 text-rose-700'
                      : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  }`}
                >
                  {amount.toLocaleString()}원
                </button>
              ))}
            </div>
            
            {/* 직접 입력 */}
            <input
              type="number"
              value={donationForm.amount}
              onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="직접 입력 (최소 1,000원)"
              min="1000"
              step="1000"
              required
            />
          </div>

          {/* 기부 메시지 */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
            <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
              <MessageCircle size={20} />
              기부 메시지 (선택사항)
            </h3>
            <textarea
              value={donationForm.message}
              onChange={(e) => setDonationForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows="4"
              placeholder="기부와 함께 전하고 싶은 메시지를 남겨보세요..."
              maxLength="200"
            />
            <p className="text-xs text-rose-500 mt-2">
              {donationForm.message.length}/200자
            </p>
          </div>

          {/* 결제 정보 안내 */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CreditCard size={20} />
              결제 안내
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>• 안전한 결제 시스템을 통해 기부금이 처리됩니다.</p>
              <p>• 기부 내역은 마이페이지에서 확인할 수 있습니다.</p>
              <p>• 영수증은 기부 완료 후 즉시 다운로드 가능합니다.</p>
              <p>• 모든 기부금은 투명하게 관리되며 사용 내역을 공개합니다.</p>
            </div>
          </div>

          {/* 기부하기 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                기부 처리 중...
              </>
            ) : (
              <>
                <Heart size={20} />
                {donationForm.amount && `${parseInt(donationForm.amount).toLocaleString()}원 `}기부하기
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donate; 