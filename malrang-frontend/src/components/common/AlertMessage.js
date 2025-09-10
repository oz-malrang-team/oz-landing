import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const AlertMessage = ({ error, success, onClose }) => {
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
            onClick={onClose}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;