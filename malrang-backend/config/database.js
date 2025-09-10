const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/malrang');
    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    console.log("MongoDB 없이 서버를 계속 실행합니다...");
  }
};

module.exports = connectDB;
