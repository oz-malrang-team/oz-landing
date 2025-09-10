import React from 'react';
import { X, Receipt, Download } from 'lucide-react';
import { formatDate, formatNumber } from '../../utils/formatters';

const DonationHistoryModal = ({ isOpen, onClose, donationHistory, onDownloadReceipt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-rose-200">
          <h3 className="text-lg font-bold text-rose-900">기부 내역</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
          >
            <X size={20} className="text-rose-600" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {donationHistory.length === 0 ? (
            <div className="text-center py-8">
              <Receipt size={48} className="mx-auto text-rose-300 mb-4" />
              <p className="text-rose-600 mb-2">아직 기부 내역이 없습니다</p>
              <p className="text-rose-500 text-sm">
                기부를 시작해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {donationHistory.map((item, index) => (
                <div key={index} className="bg-rose-50 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-rose-900">{item.organization}</h4>
                      <p className="text-sm text-rose-600">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-900">{formatNumber(item.amount)}원</p>
                      <p className="text-sm text-rose-600">{item.method}</p>
                    </div>
                  </div>
                  {item.message && (
                    <p className="text-sm text-rose-700 bg-white rounded-lg p-2">
                      "{item.message}"
                    </p>
                  )}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => onDownloadReceipt(item.id)}
                      className="text-rose-600 text-sm hover:text-rose-700 transition-colors flex items-center gap-1"
                    >
                      <Download size={14} />
                      영수증
                    </button>
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

export default DonationHistoryModal;