import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import api from '../services/api';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError('비밀번호는 영문자와 숫자를 포함해야 합니다.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3'))) {
      setError('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 전화번호 형식 정리
      const formattedPhone = formData.phone.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
      
      console.log('회원가입 요청 데이터:', {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        password: '****'
      });
      
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        password: formData.password
      });

      console.log('회원가입 응답:', response.data);

      if (response.data.success) {
        // 토큰 저장
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setSuccess('회원가입이 완료되었습니다! 로그인 중...');
        
        setTimeout(() => {
          navigate('/mypage');
        }, 1500);
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      console.error('에러 상세:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          method: err.config?.method
        }
      });
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message.includes('Invalid URL')) {
        setError('API 연결 설정에 문제가 있습니다. 새로고침 후 다시 시도해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

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

      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-rose-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-rose-900">말랑</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-rose-900 mb-2">회원가입</h2>
          <p className="text-rose-600">말랑과 함께 따뜻한 기부를 시작해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              <User size={16} className="inline mr-1" />
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* 이메일 입력 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          {/* 전화번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              <Phone size={16} className="inline mr-1" />
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="010-1234-5678"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent pr-12"
                placeholder="8자 이상, 영문자와 숫자 포함"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent pr-12"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                회원가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </button>

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-rose-600 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link 
                to="/login"
                className="text-rose-700 font-medium hover:text-rose-800 underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register; 