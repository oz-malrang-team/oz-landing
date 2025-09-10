import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Send,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';

const Support = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 탭 상태
  const [activeTab, setActiveTab] = useState('my-questions'); // 'my-questions', 'faq', 'new-question'

  // 내 질문 목록
  const [myQuestions, setMyQuestions] = useState([]);
  const [questionFilter, setQuestionFilter] = useState('all'); // 'all', 'pending', 'answered'

  // FAQ 목록
  const [faqs, setFaqs] = useState([]);
  const [faqCategory, setFaqCategory] = useState('all');

  // 새 질문 작성
  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    content: '',
    category: 'general',
    priority: 'medium'
  });

  // 선택된 질문 상세
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);

  const categories = [
    { value: 'general', label: '일반 문의' },
    { value: 'donation', label: '기부 관련' },
    { value: 'payment', label: '결제 문의' },
    { value: 'account', label: '계정 문의' },
    { value: 'technical', label: '기술 지원' },
    { value: 'other', label: '기타' }
  ];

  const priorities = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '보통' },
    { value: 'high', label: '높음' },
    { value: 'urgent', label: '긴급' }
  ];

  // 인증 검사
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // 내 질문 목록 로드
  const loadMyQuestions = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (questionFilter !== 'all') {
        params.status = questionFilter;
      }

      const response = await api.get('/support/my-questions', { params });
      if (response.data.success) {
        setMyQuestions(response.data.data.questions);
      }
    } catch (err) {
      console.error('질문 목록 로드 오류:', err);
      setError('질문 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // FAQ 목록 로드
  const loadFaqs = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (faqCategory !== 'all') {
        params.category = faqCategory;
      }

      const response = await api.get('/support/faq', { params });
      if (response.data.success) {
        setFaqs(response.data.data.faqs);
      }
    } catch (err) {
      console.error('FAQ 로드 오류:', err);
      setError('FAQ를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 FAQ 미리 로드
  useEffect(() => {
    if (!isAuthenticated || loading) return;
    
    // FAQ는 페이지 로드 시 미리 로드
    loadFaqs();
  }, [isAuthenticated, loading]);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (!isAuthenticated || loading) return;

    if (activeTab === 'my-questions') {
      loadMyQuestions();
    } else if (activeTab === 'faq') {
      loadFaqs();
    }
  }, [activeTab, questionFilter, faqCategory, isAuthenticated, loading]);

  // 새 질문 제출
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newQuestion.subject.trim() || !newQuestion.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/support/questions', newQuestion);
      
      if (response.data.success) {
        setSuccess('질문이 성공적으로 등록되었습니다.');
        setNewQuestion({ subject: '', content: '', category: 'general', priority: 'medium' });
        setActiveTab('my-questions');
        loadMyQuestions();
      }
    } catch (err) {
      console.error('질문 등록 오류:', err);
      setError(err.response?.data?.message || '질문 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 질문 상세 보기
  const handleViewQuestion = async (questionId) => {
    try {
      const response = await api.get(`/support/questions/${questionId}`);
      if (response.data.success) {
        setSelectedQuestion(response.data.data.question);
        setShowQuestionDetail(true);
      }
    } catch (err) {
      console.error('질문 상세 조회 오류:', err);
      setError('질문을 불러오는데 실패했습니다.');
    }
  };

  // 상태별 아이콘
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'answered':
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  // 상태별 텍스트
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '답변 대기';
      case 'answered':
        return '답변 완료';
      default:
        return '알 수 없음';
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner />
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
        title="고객센터" 
        onBack={() => navigate('/mypage')}
        showSettings={false}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 브레드크럼 네비게이션 */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-rose-600">
            <button 
              onClick={() => navigate('/mypage')}
              className="hover:text-rose-700 hover:underline"
            >
              마이페이지
            </button>
            <ChevronRight size={14} className="text-rose-400" />
            <span className="text-rose-900 font-medium">고객센터</span>
          </nav>
        </div>

        {/* 페이지 제목 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-rose-900 mb-2">고객센터</h2>
          <p className="text-rose-600">궁금한 점이나 문의사항을 언제든지 남겨주세요</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-rose-100">
            <button
              onClick={() => setActiveTab('my-questions')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'my-questions'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-rose-400 hover:text-rose-600'
              }`}
            >
              내 문의
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-rose-400 hover:text-rose-600'
              }`}
            >
              자주 묻는 질문
            </button>
            <button
              onClick={() => setActiveTab('new-question')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'new-question'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-rose-400 hover:text-rose-600'
              }`}
            >
              문의하기
            </button>
          </div>
        </div>

        {/* 내 문의 탭 */}
        {activeTab === 'my-questions' && (
          <div className="space-y-6">
            {/* 필터 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <select
                  value={questionFilter}
                  onChange={(e) => setQuestionFilter(e.target.value)}
                  className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">전체</option>
                  <option value="pending">답변 대기</option>
                  <option value="answered">답변 완료</option>
                </select>
                <button
                  onClick={() => setActiveTab('new-question')}
                  className="ml-auto bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  새 문의
                </button>
              </div>
            </div>

            {/* 질문 목록 */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                </div>
              ) : myQuestions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <MessageSquare size={48} className="mx-auto text-rose-300 mb-4" />
                  <p className="text-rose-600">아직 문의하신 내용이 없습니다.</p>
                  <button
                    onClick={() => setActiveTab('new-question')}
                    className="mt-4 text-rose-600 hover:text-rose-700 underline"
                  >
                    첫 문의를 작성해보세요
                  </button>
                </div>
              ) : (
                myQuestions.map((question) => (
                  <div key={question._id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(question.status)}
                          <span className="text-sm text-rose-600">
                            {getStatusText(question.status)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(question.priority)}`}>
                            {priorities.find(p => p.value === question.priority)?.label}
                          </span>
                          <span className="text-xs text-rose-400">
                            {categories.find(c => c.value === question.category)?.label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-rose-900 mb-2">{question.subject}</h3>
                        <p className="text-rose-600 text-sm line-clamp-2">{question.content}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewQuestion(question._id)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <ChevronRight size={16} className="text-rose-300" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-rose-400">
                      <span>
                        {new Date(question.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {question.adminResponse?.respondedAt && (
                        <span>
                          답변: {new Date(question.adminResponse.respondedAt).toLocaleDateString('ko-KR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* FAQ 탭 */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* 카테고리 필터 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <select
                value={faqCategory}
                onChange={(e) => setFaqCategory(e.target.value)}
                className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">전체 카테고리</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* FAQ 목록 */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                </div>
              ) : faqs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <MessageSquare size={48} className="mx-auto text-rose-300 mb-4" />
                  <p className="text-rose-600">FAQ가 없습니다.</p>
                </div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq._id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded-full">
                        {categories.find(c => c.value === faq.category)?.label}
                      </span>
                      <span className="text-xs text-rose-400 flex items-center gap-1">
                        <Eye size={12} />
                        {faq.viewCount}
                      </span>
                    </div>
                    <h3 className="font-semibold text-rose-900 mb-3">{faq.subject}</h3>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-rose-700 text-sm whitespace-pre-line">
                        {faq.adminResponse?.content}
                      </p>
                      {faq.adminResponse?.respondedBy && (
                        <div className="mt-3 pt-3 border-t border-rose-200">
                          <span className="text-xs text-rose-500">
                            답변: {faq.adminResponse.respondedBy} · {new Date(faq.adminResponse.respondedAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 새 문의 탭 */}
        {activeTab === 'new-question' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-900 mb-6">새 문의 작성</h2>
            
            <form onSubmit={handleSubmitQuestion} className="space-y-6">
              {/* 카테고리 및 우선순위 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">
                    우선순위
                  </label>
                  <select
                    value={newQuestion.priority}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="문의 제목을 입력해주세요"
                  maxLength={200}
                  required
                />
                <div className="text-xs text-rose-400 mt-1">
                  {newQuestion.subject.length}/200
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-2">
                  내용
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="문의 내용을 상세히 작성해주세요"
                  rows={8}
                  maxLength={2000}
                  required
                />
                <div className="text-xs text-rose-400 mt-1">
                  {newQuestion.content.length}/2000
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      등록 중...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      문의 등록
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <div className="bg-white border-t border-rose-200 px-6 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/mypage')}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            <span>마이페이지</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-sm"
            >
              설정
            </button>
          </div>
        </div>
      </div>

      {/* 질문 상세 모달 */}
      {showQuestionDetail && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-rose-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuestionDetail(false)}
                  className="p-2 hover:bg-rose-100 rounded-full transition-colors"
                  title="뒤로가기"
                >
                  <ArrowLeft size={20} className="text-rose-600" />
                </button>
                <h3 className="text-lg font-bold text-rose-900">문의 상세</h3>
              </div>
              <button
                onClick={() => setShowQuestionDetail(false)}
                className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-100 rounded-full transition-colors"
                title="닫기"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 질문 정보 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(selectedQuestion.status)}
                  <span className="text-sm text-rose-600">
                    {getStatusText(selectedQuestion.status)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedQuestion.priority)}`}>
                    {priorities.find(p => p.value === selectedQuestion.priority)?.label}
                  </span>
                  <span className="text-xs text-rose-400">
                    {categories.find(c => c.value === selectedQuestion.category)?.label}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-rose-900 mb-3">
                  {selectedQuestion.subject}
                </h4>

                <div className="bg-rose-50 rounded-lg p-4 mb-4">
                  <p className="text-rose-700 whitespace-pre-line">
                    {selectedQuestion.content}
                  </p>
                </div>

                <div className="text-xs text-rose-400">
                  작성일: {new Date(selectedQuestion.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* 답변 */}
              {selectedQuestion.adminResponse?.content && (
                <div>
                  <h5 className="font-semibold text-rose-900 mb-3">답변</h5>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-700 whitespace-pre-line mb-3">
                      {selectedQuestion.adminResponse.content}
                    </p>
                    <div className="text-xs text-green-600 pt-3 border-t border-green-200">
                      답변자: {selectedQuestion.adminResponse.respondedBy} · {new Date(selectedQuestion.adminResponse.respondedAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support; 
