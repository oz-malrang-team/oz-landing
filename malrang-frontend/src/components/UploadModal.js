import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { communityAPI } from "../services/api";

const UploadModal = ({ visible, onClose, onUploadSuccess, editingPost = null }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const isEditing = !!editingPost;

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "");
      setContent(editingPost.content || "");
      setMediaType(editingPost.mediaType || "image");
      setTags(editingPost.tags ? editingPost.tags.join(", ") : "");
      if (editingPost.mediaUrl) {
        setPreviewUrl(editingPost.mediaUrl);
      }
    } else {
      // 새 게시물 작성 시 폼 초기화
      setTitle("");
      setContent("");
      setSelectedFile(null);
      setMediaType("image");
      setPreviewUrl(null);
      setTags("");
      setError("");
    }
  }, [editingPost, visible]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      // 파일 타입 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        setError("지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, MP4만 지원)");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError("");
      
      // 파일 타입에 따라 미디어 타입 설정
      if (file.type.startsWith('video/')) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (title.trim().length > 100) {
      setError("제목은 100자를 초과할 수 없습니다.");
      return;
    }

    if (content.trim().length > 2000) {
      setError("내용은 2000자를 초과할 수 없습니다.");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("tags", tags.trim());
      
      if (selectedFile) {
        formData.append("media", selectedFile);
        formData.append("mediaType", mediaType);
      }

      console.log("게시물 업로드 시도:", {
        title: title.trim(),
        content: content.trim(),
        mediaType,
        hasFile: !!selectedFile,
        isEditing,
        fileSize: selectedFile?.size
      });

      let response;
      if (isEditing) {
        response = await communityAPI.updatePost(editingPost._id, formData);
      } else {
        response = await communityAPI.createPost(formData);
      }

      console.log("업로드 응답:", response.data);

      if (response.data.success) {
        alert(isEditing ? "게시물이 수정되었습니다." : "게시물이 업로드되었습니다.");
        resetForm();
        onUploadSuccess();
      } else {
        setError(response.data.message || "업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("업로드 에러:", error);
      
      // 더 구체적인 에러 메시지 제공
      if (error.response?.status === 413) {
        setError("파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.");
      } else if (error.response?.status === 415) {
        setError("지원하지 않는 파일 형식입니다.");
      } else if (error.response?.data?.message) {
        setError(`업로드 실패: ${error.response.data.message}`);
      } else if (error.code === 'NETWORK_ERROR') {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError("업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedFile(null);
    setMediaType("image");
    setPreviewUrl(null);
    setTags("");
    setError("");
  };

  const handleClose = () => {
    if (title.trim() || content.trim() || selectedFile) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-rose-200">
          <h2 className="text-lg font-bold text-rose-900">
            {isEditing ? "게시물 수정" : "새 게시물"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <div className="text-xs text-rose-400 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              내용 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={4}
              maxLength={2000}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-rose-400 mt-1">
              {content.length}/2000
            </div>
          </div>

          {/* 미디어 업로드 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              미디어 (선택사항)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <div className="text-xs text-rose-500">
                이미지 또는 동영상 (최대 10MB)
              </div>
            </div>
          </div>

          {/* 미디어 타입 선택 */}
          {selectedFile && (
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                미디어 타입
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="image">이미지</option>
                <option value="video">동영상</option>
              </select>
            </div>
          )}

          {/* 미디어 미리보기 */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                미리보기
              </label>
              <div className="relative">
                {mediaType === "image" ? (
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-lg border border-rose-200"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 object-cover rounded-lg border border-rose-200"
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setMediaType("image");
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              태그 (선택사항)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그를 쉼표로 구분하여 입력하세요"
              className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <div className="text-xs text-rose-500 mt-1">
              예: 기부, 봉사, 나눔
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 p-4 border-t border-rose-200">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !title.trim() || !content.trim()}
            className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>업로드 중...</span>
              </div>
            ) : (
              isEditing ? "수정하기" : "업로드하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
