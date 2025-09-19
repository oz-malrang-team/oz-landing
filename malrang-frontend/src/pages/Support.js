import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MobileHeader from '../components/common/MobileHeader';
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
import { api } from '../services/api';

const Support = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [activeTab, setActiveTab] = useState('faq'); // FAQ 탭을 기본으로 설정
  
  // 새 티켓 작성 상태
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });

  // 티켓 상세보기 상태
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // FAQ 데이터
  const [faqs, setFaqs] = useState([
    {
      _id: '1',
      subject: '기부금 영수증은 어떻게 발급받을 수 있나요?',
      content: '기부금 영수증 발급 방법이 궁금합니다.',
      category: 'donation',
      adminResponse: {
        content: '기부금 영수증은 마이페이지의 기부 내역에서 직접 발급받으실 수 있습니다. 연말정산 시 필요한 기부금 영수증은 국세청 연말정산 간소화 서비스에 자동 등록되므로, 별도로 제출하지 않으셔도 됩니다.',
        respondedBy: '고객지원팀',
        respondedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      viewCount: 256
    },
    {
      _id: '2',
      subject: '정기후원 금액을 변경하거나 중단하고 싶어요.',
      content: '정기후원 관리 방법이 궁금합니다.',
      category: 'donation',
      adminResponse: {
        content: '정기후원 금액 변경 및 중단은 마이페이지의 정기후원 관리 메뉴에서 직접 신청하실 수 있습니다. 후원금 변경은 다음 결제일로부터, 중단은 신청 즉시 반영됩니다. 자세한 내용은 고객센터로 문의해 주시면 친절하게 안내해 드리겠습니다.',
        respondedBy: '고객지원팀',
        respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      viewCount: 189
    },
    {
      _id: '3',
      subject: '나눔가게에서 물품을 판매하고 싶어요.',
      content: '나눔가게 물품 등록 방법이 궁금합니다.',
      category: 'general',
      adminResponse: {
        content: '나눔가게는 개인 간의 물품 나눔과 거래를 지원하는 커뮤니티 공간입니다. 상품을 등록하려면 커뮤니티 페이지에서 글쓰기 버튼을 누른 후, 글쓰기 유형을 나눔가게로 선택해 주세요. 판매 수익금의 일부 또는 전부를 기부할 수 있는 옵션도 제공하고 있습니다.',
        respondedBy: '고객지원팀',
        respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      viewCount: 142
    },
    {
      _id: '4',
      subject: '후원한 기부금이 어떻게 사용되는지 궁금해요.',
      content: '기부금 사용 내역을 투명하게 확인하고 싶습니다.',
      category: 'donation',
      adminResponse: {
        content: 'Malrang은 투명한 기부금 운영을 최우선으로 생각합니다. 후원하신 기부금의 사용 내역은 각 캠페인의 임팩트 리포트에서 자세히 확인하실 수 있습니다. 또한, 정기후원자분들께는 매월 뉴스레터를 통해 기부금의 사용 현황과 변화를 정기적으로 공유해 드립니다.',
        respondedBy: '고객지원팀',
        respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      viewCount: 298
    }
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortTickets();
  }, [tickets, searchTerm, filterStatus, sortBy]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/support/tickets');
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('티켓 조회 오류:', error);
      setError('티켓을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTickets = () => {
    let filtered = [...tickets];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터링
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/support/tickets', newTicket);
      setTickets(prev => [response.data.ticket, ...prev]);
      setNewTicket({ subject: '', message: '', priority: 'medium', category: 'general' });
      setShowNewTicket(false);
      setSuccess('문의가 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('티켓 생성 오류:', error);
      setError('문의 등록 중 오류가 발생했습니다.');
    }
  };

  const handleReplyToTicket = async (ticketId) => {
    if (!replyMessage.trim()) {
      setError('답변 내용을 입력해주세요.');
      return;
    }

    try {
      await api.post(`/support/tickets/${ticketId}/reply`, {
        message: replyMessage
      });
      
      // 티켓 목록 새로고침
      await fetchTickets();
      
      // 선택된 티켓 정보 업데이트
      const updatedTicket = tickets.find(t => t._id === ticketId);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
      
      setReplyMessage('');
      setSuccess('답변이 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('답변 등록 오류:', error);
      setError('답변 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/support/tickets/${ticketId}`);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      setSuccess('문의가 성공적으로 삭제되었습니다.');
      
      if (selectedTicket && selectedTicket._id === ticketId) {
        setShowTicketDetail(false);
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('티켓 삭제 오류:', error);
      setError('문의 삭제 중 오류가 발생했습니다.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-rose-500" />;
      case 'answered':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-rose-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return '대기중';
      case 'in_progress':
        return '처리중';
      case 'resolved':
        return '해결됨';
      default:
        return '알 수 없음';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'general':
        return '일반 문의';
      case 'technical':
        return '기술 문의';
      case 'billing':
        return '결제 문의';
      case 'bug':
        return '버그 신고';
      default:
        return '기타';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="고객지원" />
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-500 mb-4">고객지원 서비스를 이용하려면 로그인해주세요.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="고객지원" />
        <div className="p-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="고객지원" />
      
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="p-4">
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-600 hover:text-rose-600'
              }`}
            >
              자주묻는 질문
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-600 hover:text-rose-600'
              }`}
            >
              나의 문의
            </button>
          </div>
        </div>

        {/* FAQ 섹션 */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
              <p className="text-sm text-gray-600 mb-4">
                말랑 서비스 이용 중 궁금한 점들을 확인해보세요.
              </p>
            </div>
            
            {faqs.map((faq) => (
              <div key={faq._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{faq.subject}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-full">
                          {faq.category === 'donation' ? '기부' : '일반'}
                        </span>
                        <span>조회 {faq.viewCount}회</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {faq.adminResponse && (
                  <div className="p-4 bg-rose-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-rose-800">답변</span>
                      <span className="text-xs text-rose-600">
                        {faq.adminResponse.respondedBy} • {new Date(faq.adminResponse.respondedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-rose-700 leading-relaxed whitespace-pre-wrap">
                      {faq.adminResponse.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 나의 문의 섹션 */}
        {activeTab === 'tickets' && (
          <>
            {/* 헤더 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-800">나의 문의</h1>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  새 문의
                </button>
              </div>

              {/* 검색 및 필터 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="문의 제목이나 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="all">모든 상태</option>
                  <option value="pending">대기중</option>
                  <option value="answered">답변완료</option>
                  <option value="closed">해결됨</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="priority">우선순위순</option>
                </select>
              </div>
            </div>

            {/* 티켓 목록 */}
            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">문의가 없습니다</h3>
                  <p className="text-gray-500 mb-4">새로운 문의를 작성해보세요.</p>
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    첫 문의 작성하기
                  </button>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket._id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                    setSelectedTicket(ticket);
                    setShowTicketDetail(true);
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{ticket.content || ticket.message}</p>
                      </div>
                      <div className="ml-3 flex items-center">
                        {getStatusIcon(ticket.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {ticket.category}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                          {ticket.priority}
                        </span>
                      </div>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* 새 문의 작성 모달 */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">새 문의 작성</h2>
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="문의 제목을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="general">일반 문의</option>
                  <option value="donation">기부 문의</option>
                  <option value="payment">결제 문의</option>
                  <option value="account">계정 문의</option>
                  <option value="technical">기술 문의</option>
                  <option value="other">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-32 resize-none"
                  placeholder="문의 내용을 자세히 입력하세요"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  문의 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 티켓 상세보기 모달 */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{selectedTicket.subject}</h2>
                <button
                  onClick={() => setShowTicketDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* 티켓 정보 */}
              <div className="flex items-center gap-4 text-sm">
                {getStatusIcon(selectedTicket.status)}
                <span className="font-medium">{getStatusText(selectedTicket.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority === 'high' ? '높음' : selectedTicket.priority === 'medium' ? '보통' : '낮음'}
                </span>
                <span className="text-gray-500">{getCategoryText(selectedTicket.category)}</span>
                <span className="text-gray-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
              
              {/* 티켓 내용 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>
              
              {/* 답변 목록 */}
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">답변</h3>
                  {selectedTicket.replies.map((reply, index) => (
                    <div key={index} className="bg-rose-50 rounded-lg p-3 border border-rose-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-rose-800">관리자</span>
                        <span className="text-xs text-rose-600">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-rose-700 whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 답변 작성 */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-2">답변 작성</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24 resize-none"
                  placeholder="답변 내용을 입력하세요"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleReplyToTicket(selectedTicket._id)}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    답변 등록
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(selectedTicket._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    문의 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support; 
