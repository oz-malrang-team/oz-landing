import { useState, useEffect, createContext, useContext } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState("unknown");

  useEffect(() => {
    checkServerStatus();
    checkAuthStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      // health 엔드포인트는 /api 없이 직접 접근
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
      const healthUrl = baseUrl.replace('/api', '') + '/health';
      
      const response = await fetch(healthUrl);
      const data = await response.json();
      setServerStatus(data.database === "connected" ? "connected" : "disconnected");
    } catch (error) {
      setServerStatus("disconnected");
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.success) {
        const { accessToken, refreshToken, user: userData } = response.data.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        console.error("로그인 실패:", response.data);
        return { 
          success: false, 
          message: response.data.message || "로그인에 실패했습니다." 
        };
      }
    } catch (error) {
      // 서버 연결 상태 확인
      await checkServerStatus();
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          message: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요." 
        };
      }
      
      if (serverStatus === "disconnected") {
        return { 
          success: false, 
          message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || "로그인에 실패했습니다." 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      
      if (response.data.success) {
        return { success: true, message: "회원가입이 완료되었습니다." };
      } else {
        return { 
          success: false, 
          message: response.data.message || "회원가입에 실패했습니다." 
        };
      }
    } catch (error) {
      
      // 서버 연결 상태 확인
      await checkServerStatus();
      
      if (serverStatus === "disconnected") {
        return { 
          success: false, 
          message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || "회원가입에 실패했습니다." 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      // 로그아웃 에러는 무시 (토큰 정리는 finally에서 수행)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    serverStatus,
    login,
    register,
    logout,
    updateUser,
    checkServerStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
