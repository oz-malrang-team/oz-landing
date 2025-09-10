// models/Support.js
// 고객센터 질문/답변 모델

const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: {
    type: String,
    enum: ['general', 'donation', 'payment', 'account', 'technical', 'other'],
    default: 'general'
  },
  subject: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminResponse: {
    content: { 
      type: String, 
      default: null 
    },
    respondedBy: { 
      type: String, 
      default: null 
    },
    respondedAt: { 
      type: Date, 
      default: null 
    }
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  tags: [String],
  viewCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// 인덱스 설정
supportSchema.index({ userId: 1 });
supportSchema.index({ status: 1 });
supportSchema.index({ category: 1 });
supportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Support', supportSchema); 