import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Receipt, Download, Calendar, DollarSign, FileText, Search, Filter, SortAsc, SortDesc, Eye, Trash2, RefreshCw, X } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Receipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    if (user) {
      fetchReceipts();
    }
  }, [user, filterYear]);

  useEffect(() => {
    filterAndSortReceipts();
  }, [receipts, searchTerm, sortBy, sortOrder, filterYear]);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await api.get(`/donations?year=${filterYear}&page=1&limit=100`);
      
      if (response.data.success) {
        const donations = response.data.data.donations.map(donation => ({
          id: donation.receiptId,
          amount: donation.amount,
          organization: donation.organization,
          donationType: donation.isRecurring ? "정기기부" : "일시기부",
          createdAt: donation.date,
          status: "완료",
          description: `${donation.category} 기부`,
          category: donation.category
        }));
        
        setReceipts(donations);
        setPagination(response.data.data.pagination);
      } else {
        throw new Error(response.data.message || "기부 내역을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("기부 내역 조회 실패:", error);
      setError("기부 내역을 불러오는데 실패했습니다.");
      
      // 에러 시 빈 배열로 설정
      setReceipts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortReceipts = () => {
    let filtered = [...receipts];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.donationType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "organization":
          aValue = a.organization.toLowerCase();
          bValue = b.organization.toLowerCase();
          break;
        case "date":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReceipts(filtered);
  };

  const handleDownloadReceipt = async (receiptId) => {
    try {
      const response = await api.get(`/donations/${receiptId}/receipt`);
      
      if (response.data.success) {
        // 실제 구현에서는 PDF 다운로드 처리
        const receiptData = response.data.data.receiptData;
        alert(`영수증 다운로드 준비 완료: ${receiptData.receiptId}`);
      } else {
        throw new Error(response.data.message || "영수증 다운로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("영수증 다운로드 실패:", error);
      alert("영수증 다운로드에 실패했습니다.");
    }
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const handleRefresh = () => {
    fetchReceipts();
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="영수증 관리" showBack={true} />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Receipt size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 text-center mb-6">
            영수증을 확인하려면 로그인해주세요.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="영수증 관리" showBack={true} />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 통계 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">2024년 기부 현황</h2>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {receipts.length}
              </div>
              <div className="text-sm text-gray-500">총 기부횟수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(receipts.reduce((sum, receipt) => sum + receipt.amount, 0))}원
              </div>
              <div className="text-sm text-gray-500">총 기부금액</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatAmount(Math.round(receipts.reduce((sum, receipt) => sum + receipt.amount, 0) * 0.15))}원
              </div>
              <div className="text-sm text-gray-500">세액공제액</div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="기관명, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {getYearOptions().map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">날짜</option>
                    <option value="amount">금액</option>
                    <option value="organization">기관명</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 영수증 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <FileText size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : filteredReceipts.length === 0 ? (
            <div className="text-center py-16">
              <Receipt size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">영수증이 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {filterYear}년에 기부 내역이 없습니다.
              </p>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                기부하러 가기
              </Link>
            </div>
          ) : (
            filteredReceipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Receipt size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{receipt.organization}</h3>
                      <p className="text-sm text-gray-500">{receipt.donationType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatAmount(receipt.amount)}원
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(receipt.createdAt)}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{receipt.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    {receipt.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewReceipt(receipt)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="상세보기"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadReceipt(receipt.id)}
                      className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                      title="다운로드"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 영수증 상세 모달 */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">영수증 상세</h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영수증 번호</label>
                  <p className="text-gray-900">{selectedReceipt.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기관명</label>
                  <p className="text-gray-900">{selectedReceipt.organization}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기부 금액</label>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(selectedReceipt.amount)}원</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기부 유형</label>
                  <p className="text-gray-900">{selectedReceipt.donationType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기부 일자</label>
                  <p className="text-gray-900">{formatDate(selectedReceipt.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <p className="text-gray-900">{selectedReceipt.description}</p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleDownloadReceipt(selectedReceipt.id)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  다운로드
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
