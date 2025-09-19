import axios from "axios";

// 환경변수를 안전하게 처리
const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  const fallbackUrl = "http://localhost:8080/api";
  
  // 환경변수가 undefined이거나 빈 문자열인 경우 fallback 사용
  if (!envUrl || envUrl.trim() === "") {
    console.warn("REACT_APP_API_URL이 설정되지 않았습니다. fallback URL을 사용합니다.");
    return fallbackUrl;
  }
  
  return envUrl;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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
        const refreshToken = localStorage.getItem("refreshToken");
        // API_BASE_URL을 사용하여 명시적으로 전체 URL 구성
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });
        
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 새로고침 실패:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // 강제 리다이렉트 제거 - 컴포넌트에서 처리하도록 함
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 커뮤니티 관련 API 헬퍼 함수들
export const communityAPI = {
  // 게시물 목록 조회
  getPosts: (params = {}) => {
    const { page = 1, limit = 20, sort = 'recent' } = params;
    return api.get(`/community/posts?page=${page}&limit=${limit}&sort=${sort}`);
  },
  
  // 게시물 상세 조회
  getPost: (id) => {
    return api.get(`/community/posts/${id}`);
  },
  
  // 게시물 작성
  createPost: (formData) => {
    return api.post('/community/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시물 수정
  updatePost: (id, formData) => {
    return api.put(`/community/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시물 삭제
  deletePost: (id) => {
    return api.delete(`/community/posts/${id}`);
  },
  
  // 좋아요 토글
  toggleLike: (id) => {
    return api.post(`/community/posts/${id}/like`);
  },
  
  // 댓글 작성
  createComment: (postId, content) => {
    return api.post(`/community/posts/${postId}/comments`, { content });
  },
  
  // 댓글 삭제
  deleteComment: (postId, commentId) => {
    return api.delete(`/community/posts/${postId}/comments/${commentId}`);
  }
};

// named export와 default export 모두 제공
export { api };
export default api;
