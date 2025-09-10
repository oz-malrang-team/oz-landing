// models/RecurringDonation.js
// 정기기부 데이터 모델 정의

const mongoose = require('mongoose');

const recurringDonationSchema = new mongoose.Schema({
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
    min: 1000
  },
  frequency: { 
    type: String, 
    enum: ['monthly', 'weekly'], 
    required: true 
  },
  nextDate: { 
    type: Date, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// 정기기부 조회를 위한 인덱스
recurringDonationSchema.index({ userId: 1, active: -1 });
recurringDonationSchema.index({ nextDate: 1, active: 1 }); // 실행 대기 중인 기부

module.exports = mongoose.model('RecurringDonation', recurringDonationSchema);