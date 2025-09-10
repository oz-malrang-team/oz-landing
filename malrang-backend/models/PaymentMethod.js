// models/PaymentMethod.js
// 결제 수단 데이터 모델 정의

const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['card', 'bank'], 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  maskedNumber: { 
    type: String, 
    required: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// 결제 수단 조회를 위한 인덱스
paymentMethodSchema.index({ userId: 1, active: 1, isDefault: -1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);