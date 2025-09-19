import React from "react";
import { useAuth } from "../hooks/useAuth";

const CommunityCard = ({ post, onPress, onEdit, onDelete, onLike }) => {
  const { user } = useAuth();
  
  // 임시 디버깅
  console.log("CommunityCard 디버깅:");
  console.log("현재 사용자:", user);
  console.log("게시물 작성자:", post.userId);
  console.log("user?.id:", user?.id);
  console.log("user?._id:", user?._id);
  console.log("post.userId?._id:", post.userId?._id);
  
  const isAuthor = user && post.userId && (
    String(user.id || user._id) === String(post.userId._id || post.userId.id || post.userId)
  );
  
  console.log("isAuthor 결과:", isAuthor);

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    
    if (onDelete) {
      onDelete(post._id);
    } else {
      console.error("onDelete 함수가 전달되지 않았습니다.");
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(post._id);
    }
  };

  const isLiked = post.likes?.includes(user?.id);
  const likeCount = post.likes?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full border border-gray-100 hover:shadow-md transition-shadow">
      <div onClick={onPress} className="cursor-pointer">
        {/* 헤더 */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center">
                {post.userId?.profileImage ? (
                  <img
                    src={post.userId.profileImage}
                    alt={post.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {post.userId?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {post.userId?.name || "익명"}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  title="수정"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 py-3">
          <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {post.content}
          </p>

          {/* 미디어 */}
          {post.mediaUrl && (
            <div className="mt-3">
              {post.mediaType === 'image' && (
                <div className="relative">
                  <img
                    src={(() => {
                      try {
                        if (!post.mediaUrl) {
                          return null;
                        }
                        
                        if (post.mediaUrl.startsWith('http')) {
                          return post.mediaUrl;
                        }
                        
                        // 파일명만 추출 (더 안전하게)
                        const filename = post.mediaUrl.includes('/') 
                          ? post.mediaUrl.split('/').pop() 
                          : post.mediaUrl;
                        
                        if (!filename) {
                          return null;
                        }
                        
                        // 프론트엔드 public/images/posts/ 경로 사용
                        const imageUrl = `/images/posts/${filename}`;
                        return imageUrl;
                      } catch (error) {
                        return null;
                      }
                    })()}
                    alt="첨부 이미지"
                    className="w-full h-48 object-cover rounded-lg"
                    onLoad={(e) => {
                      // 로드 성공 시 fallback 숨기기
                      const fallback = e.target.parentElement.querySelector('.image-fallback');
                      if (fallback) {
                        fallback.style.display = 'none';
                      }
                    }}
                    onError={(e) => {
                      const originalSrc = e.target.src;
                      
                      // 이미 placeholder인 경우 재시도하지 않음
                      if (originalSrc.startsWith('data:image/svg+xml')) {
                        return;
                      }
                      
                      // 한 번 더 시도 (캐시 무시)
                      if (!e.target.dataset.retried) {
                        e.target.dataset.retried = 'true';
                        const cacheBuster = `?t=${Date.now()}`;
                        e.target.src = originalSrc + cacheBuster;
                        return;
                      }
                      
                      // 최종적으로 placeholder 이미지로 대체
                      e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
                            🖼️ 이미지를 불러올 수 없습니다
                          </text>
                          <text x="50%" y="65%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="10">
                            ${post.title || '제목 없음'}
                          </text>
                        </svg>
                      `)}`;
                      
                      // onError 이벤트 제거하여 무한 루프 방지
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}
              {post.mediaType === 'video' && (
                <div className="relative">
                  <video
                    src={post.mediaUrl.startsWith('http') ? post.mediaUrl : `http://localhost:8080${post.mediaUrl}`}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                    onLoadStart={(e) => {
                      console.log("비디오 로드 시작:", e.target.src);
                    }}
                    onError={(e) => {
                      console.error("비디오 로드 실패:", e.target.src);
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">동영상을 불러올 수 없습니다</p>
                      <p className="text-xs text-gray-400 mt-1">{post.mediaUrl}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full border border-rose-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 액션 바 */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`}
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm">{likeCount}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">{post.comments?.length || 0}</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm">{post.viewCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
