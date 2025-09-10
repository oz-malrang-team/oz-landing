import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const YearEndTab = ({ donationHistory, totalAmount, onDownload, onError }) => {
  const generateMonthlyData = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = donationHistory.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === 2024;
      });
      const amount = monthData.reduce((sum, item) => sum + item.amount, 0);
      const count = monthData.length;
      return { month, amount, count };
    });
  };

  const handleDownload = () => {
    if (donationHistory.length === 0) {
      onError('다운로드할 기부 내역이 없습니다.');
    } else {
      onDownload();
    }
  };

  return (
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
                {formatNumber(totalAmount)}원
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

        {/* 월별 현황 */}
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
            {generateMonthlyData().map(({ month, amount, count }) => (
              <div key={month} className="bg-rose-50 rounded-xl p-4 text-center">
                <div className="text-xl font-bold mb-2 text-rose-900">{month}월</div>
                <div className="text-lg font-bold text-rose-600 mb-1">
                  {amount > 0 ? formatNumber(amount) + '원' : '0원'}
                </div>
                <div className="text-sm text-rose-500">
                  {count}회 기부
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleDownload}
            disabled={donationHistory.length === 0}
            className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} className="inline mr-2" />
            연말정산용 데이터 다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearEndTab;