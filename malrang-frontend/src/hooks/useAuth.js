import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('로그인 시도:', { email, password: password ? '****' : 'empty' });
      const response = await api.post('/auth/login', { email, password });
      console.log('로그인 응답:', response.data);
      
      if (response.data.success) {
        const { accessToken, refreshToken, user: userData } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        console.error('로그인 실패:', response.data);
        return { 
          success: false, 
          message: response.data.message || '로그인에 실패했습니다.' 
        };
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      console.error('에러 응답:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    fetchUserProfile,
    updateUser
  };
};