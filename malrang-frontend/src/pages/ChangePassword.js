import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff, Save, X } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // 비밀번호 확인
    if (formData.newPassword !== formData.confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 확인
    if (formData.newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }

    try {
      await api.put("/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        navigate("/mypage");
      }, 2000);
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <MobileHeader title="비밀번호 변경" />
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-rose-600">로그인이 필요합니다.</p>
            <Link
              to="/login"
              className="inline-block mt-4 bg-rose-500 text-white px-6 py-2 rounded-xl hover:bg-rose-600 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* 헤더 */}
      <MobileHeader title="비밀번호 변경" />

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이콘 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-rose-900 mb-2">비밀번호 변경</h2>
            <p className="text-rose-600">보안을 위해 정기적으로 비밀번호를 변경해주세요</p>
          </div>

          {/* 성공 메시지 */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              현재 비밀번호 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400 hover:text-rose-600"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              새 비밀번호 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400 hover:text-rose-600"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-rose-500 mt-1">6자 이상 입력해주세요</p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              새 비밀번호 확인 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400 hover:text-rose-600"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isLoading ? "변경 중..." : "변경"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChangePassword;
