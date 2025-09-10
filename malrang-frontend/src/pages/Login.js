import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('로그인 성공!');
        navigate('/mypage');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
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
              to="/"
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
          <h2 className="text-2xl font-bold text-rose-900 mb-2">로그인</h2>
          <p className="text-rose-600">말랑에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 입력 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
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
                placeholder="비밀번호를 입력하세요"
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

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center">
            <p className="text-rose-600 text-sm">
              아직 계정이 없으신가요?{' '}
              <Link 
                to="/register"
                className="text-rose-700 font-medium hover:text-rose-800 underline"
              >
                회원가입
              </Link>
            </p>
          </div>


        </form>
      </main>
    </div>
  );
};

export default Login; 