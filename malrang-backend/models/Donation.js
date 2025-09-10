// models/Donation.js
// 기부 내역 데이터 모델 정의

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  organization: { 
    type: String, 
    required: true,
    trim: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 1000 // 최소 기부금액 1,000원
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  receiptId: { 
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    default: 'general',
    enum: ['general', 'children', 'elderly', 'animal', 'environment', 'disaster']
  },
  isRecurring: { 
    type: Boolean, 
    default: false 
  },
  recurringId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RecurringDonation', 
    default: null 
  }
}, { 
  timestamps: true 
});

// 기부 조회 성능을 위한 인덱스
donationSchema.index({ userId: 1, date: -1 });
donationSchema.index({ date: 1 }); // 연말정산 쿼리용
donationSchema.index({ receiptId: 1 }, { unique: true });

module.exports = mongoose.model('Donation', donationSchema);