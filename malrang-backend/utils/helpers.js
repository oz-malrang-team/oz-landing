// utils/helpers.js
// 유틸리티 함수들

// 영수증 ID 생성기
const generateReceiptId = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `R${timestamp}${randomString}`;
};

// 숫자 포맷터 (천 단위 콤마)
const formatNumber = (num) => {
  return num.toLocaleString();
};

// 날짜 포맷터 (한국식)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 이메일 유효성 검사
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 유효성 검사 (한국 형식)
const isValidPhone = (phone) => {
  const phoneRegex = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
  return phoneRegex.test(phone);
};

// 비밀번호 강도 검사
const isStrongPassword = (password) => {
  // 최소 8자, 영문자와 숫자 포함
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
};

// API 응답 성공 형식
const successResponse = (message, data = null) => {
  const response = { success: true, message };
  if (data) response.data = data;
  return response;
};

// API 응답 에러 형식
const errorResponse = (message, statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode
  };
};

module.exports = {
  generateReceiptId,
  formatNumber,
  formatDate,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  successResponse,
  errorResponse
};