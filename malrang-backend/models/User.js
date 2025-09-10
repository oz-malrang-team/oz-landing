// models/User.js
// 사용자 데이터 모델 정의

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  profileImage: { 
    type: String, 
    default: null 
  },
  bio: { 
    type: String, 
    default: '따뜻한 마음으로 기부하는 분' 
  },
  donationGoal: { 
    type: Number, 
    default: 100000 
  },
  isPublicProfile: { 
    type: Boolean, 
    default: true 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 이메일 중복 확인을 위한 인덱스
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);