import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Save, X, Camera, Upload } from "lucide-react";
import MobileHeader from "../components/common/MobileHeader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || ""
      });
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setProfileImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("bio", formData.bio);
      
      if (profileImage) {
        submitData.append("profileImage", profileImage);
      }

      console.log("프로필 업데이트 요청:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        hasImage: !!profileImage
      });

      // 실제 API 호출 대신 목업 응답 사용
      const mockResponse = {
        data: {
          success: true,
          user: {
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            profileImage: profileImage ? URL.createObjectURL(profileImage) : user.profileImage
          }
        }
      };

      console.log("업데이트된 사용자 정보:", mockResponse.data.user);
      updateUser(mockResponse.data.user);
      
      // 실제 API 호출 (주석 해제하여 사용)
      // const response = await api.put("/user/profile", submitData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data"
      //   }
      // });
      // updateUser(response.data.user);
      
      navigate("/mypage");
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      setError("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
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
        <MobileHeader title="프로필 수정" />
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
      <MobileHeader title="프로필 수정" />

      {/* 메인 콘텐츠 */}
      <main className="max-w-md mx-auto px-6 py-8 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-600 transition-colors">
                <Camera size={16} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-rose-600 mt-2">사진을 클릭하여 변경하세요</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              이메일 *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-2">
              자기소개
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="자기소개를 입력해주세요"
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
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
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfileEdit;
