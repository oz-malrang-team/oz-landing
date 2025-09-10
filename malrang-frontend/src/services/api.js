import axios from 'axios';

// 환경변수를 안전하게 처리
const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  const fallbackUrl = 'http://localhost:8080/api';
  
  // 환경변수가 undefined이거나 빈 문자열인 경우 fallback 사용
  if (!envUrl || envUrl.trim() === '') {
    console.warn('REACT_APP_API_URL이 설정되지 않았습니다. fallback URL을 사용합니다.');
    return fallbackUrl;
  }
  
  return envUrl;
};

const API_BASE_URL = getApiBaseUrl();

// 디버깅용 로그
console.log('환경변수 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('사용할 API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // API_BASE_URL을 사용하여 명시적으로 전체 URL 구성
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('토큰 새로고침 실패:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // 강제 리다이렉트 제거 - 컴포넌트에서 처리하도록 함
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;