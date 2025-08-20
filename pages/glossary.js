import React, { useState } from 'react';
import { ArrowLeft, Search, BookOpen, ExternalLink, Filter } from 'lucide-react';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 용어 데이터
  const terms = [
    {
      id: 1,
      term: '기부금 영수증',
      definition: '기부를 받은 단체가 기부자에게 발급하는 공식 문서로, 소득공제 혜택을 받기 위해 필요한 서류입니다.',
      category: '세무',
      examples: ['연 5,000원 이상 기부 시 발급', '소득공제 신고 시 필요'],
      relatedTerms: ['소득공제', '기부금', '영수증']
    },
    {
      id: 2,
      term: '소득공제',
      definition: '기부금을 지출한 경우, 해당 금액을 소득에서 차감하여 세금을 줄이는 제도입니다.',
      category: '세무',
      examples: ['연간 총수입금액의 30%까지 공제', '연말정산 시 신고'],
      relatedTerms: ['기부금 영수증', '연말정산', '세금감면']
    },
    {
      id: 3,
      term: '연말정산',
      definition: '1년간의 소득과 지출을 정리하여 과세표준을 확정하고 세금을 정산하는 절차입니다.',
      category: '세무',
      examples: ['매년 3월까지 신고', '기부금 공제 신고 포함'],
      relatedTerms: ['소득공제', '과세표준', '세금환급']
    },
    {
      id: 4,
      term: '기부단체',
      definition: '기부를 받을 수 있는 자격을 가진 공익법인이나 비영리단체를 의미합니다.',
      category: '기부',
      examples: ['공익법인', '비영리단체', '지정기부단체'],
      relatedTerms: ['공익법인', '비영리단체', '지정기부단체']
    },
    {
      id: 5,
      term: '지정기부단체',
      definition: '국세청장이 기부금을 받을 수 있도록 지정한 단체로, 기부금 영수증 발급이 가능합니다.',
      category: '기부',
      examples: ['국세청 홈페이지에서 확인 가능', '정기적으로 지정 현황 공개'],
      relatedTerms: ['기부단체', '기부금 영수증', '공익법인']
    },
    {
      id: 6,
      term: '공익법인',
      definition: '공익을 목적으로 설립된 법인으로, 기부금을 받을 수 있는 자격을 가집니다.',
      category: '기부',
      examples: ['의료법인', '교육법인', '복지법인'],
      relatedTerms: ['기부단체', '비영리단체', '지정기부단체']
    },
    {
      id: 7,
      term: '기부금 한도',
      definition: '소득공제를 받을 수 있는 기부금의 최대 금액으로, 연간 총수입금액의 30%까지 가능합니다.',
      category: '세무',
      examples: ['연간 총수입금액의 30%', '월급여 기준으로 계산'],
      relatedTerms: ['소득공제', '기부금 영수증', '과세표준']
    },
    {
      id: 8,
      term: '과세표준',
      definition: '소득세를 계산하는 기준이 되는 금액으로, 총수입금액에서 각종 공제를 뺀 금액입니다.',
      category: '세무',
      examples: ['기부금 공제 후 계산', '세율 적용 기준'],
      relatedTerms: ['소득공제', '총수입금액', '세금계산']
    }
  ];

  const categories = [
    { id: 'all', label: '전체', count: terms.length },
    { id: '세무', label: '세무', count: terms.filter(t => t.category === '세무').length },
    { id: '기부', label: '기부', count: terms.filter(t => t.category === '기부').length }
  ];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gray-800 px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">용어 사전</h1>
            <p className="text-sm text-gray-400">기부 관련 용어를 쉽게 이해하세요</p>
          </div>
          <button className="p-2">
            <Filter size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색창 */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="용어나 설명을 검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none transition-colors"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === id
                    ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-800 text-gray-300 border border-gray-600 hover:border-pink-400 hover:text-white'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* 용어 목록 */}
        <div className="space-y-4">
          {filteredTerms.map(term => (
            <div key={term.id} className="bg-gray-800 rounded-3xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen size={24} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{term.term}</h3>
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
                      {term.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {term.definition}
                  </p>
                  
                  {/* 예시 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">예시</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.examples.map((example, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-600">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 관련 용어 */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">관련 용어</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.relatedTerms.map((relatedTerm, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchTerm(relatedTerm)}
                          className="bg-pink-900/20 text-pink-400 px-3 py-1 rounded-lg text-sm border border-pink-800 hover:bg-pink-800/30 transition-colors"
                        >
                          {relatedTerm}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full transition-colors">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-400 text-sm">
              다른 검색어를 입력하거나 카테고리를 변경해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary; 