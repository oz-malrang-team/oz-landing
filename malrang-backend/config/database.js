const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/malrang';
    console.log("MongoDB 연결 시도:", mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      connectTimeoutMS: 10000, // 10초 연결 타임아웃
    });
    
    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
    console.log(`📊 데이터베이스: ${conn.connection.name}`);
    
    // 연결 상태 모니터링
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 연결 오류:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB 연결이 끊어졌습니다.');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB 재연결 성공');
    });
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    console.log("⚠️ MongoDB 없이 서버를 계속 실행합니다...");
    console.log("💡 MongoDB를 설치하고 실행하려면:");
    console.log("   1. MongoDB Community Server 설치");
    console.log("   2. mongod 명령어로 MongoDB 서버 시작");
    console.log("   3. 또는 MongoDB Atlas 클라우드 서비스 사용");
    return false;
  }
};

module.exports = connectDB;
