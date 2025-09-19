import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { communityAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MobileHeader from "../components/common/MobileHeader";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getPost(id);
      if (response.data.success) {
        setPost(response.data.data);
      } else {
        throw new Error(response.data.message || "게시물을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("게시물을 불러오는데 실패했습니다:", error);
      alert("게시물을 불러올 수 없습니다.");
      navigate("/community");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await communityAPI.toggleLike(id);
      if (response.data.success) {
        setPost(prev => ({
          ...prev,
          likes: response.data.data.isLiked 
            ? [...prev.likes, user.id]
            : prev.likes.filter(likeId => likeId !== user.id),
          likeCount: response.data.data.likeCount
        }));
      }
    } catch (error) {
      console.error("좋아요 처리 에러:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      setSubmittingComment(true);
      const response = await communityAPI.createComment(id, comment);
      
      if (response.data.success) {
        // 댓글 목록을 새로고침
        await fetchPost();
        setComment("");
      }
    } catch (error) {
      console.error("댓글 작성 에러:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log("댓글 삭제 시도:", commentId, "게시물 ID:", id);
    
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      console.log("댓글 삭제 API 호출 중...");
      const response = await communityAPI.deleteComment(id, commentId);
      console.log("댓글 삭제 API 응답:", response.data);
      
      if (response.data.success) {
        await fetchPost();
        console.log("댓글 삭제 완료");
      } else {
        console.error("댓글 삭제 실패:", response.data.message);
        alert("댓글 삭제에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("댓글 삭제 에러:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      
      if (error.response?.status === 403) {
        alert("댓글을 삭제할 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("댓글을 찾을 수 없습니다.");
      } else {
        alert("댓글 삭제에 실패했습니다: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeletePost = async () => {
    console.log("게시물 삭제 시도:", id);
    
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

    try {
      setDeletingPost(true);
      console.log("게시물 삭제 API 호출 중...");
      const response = await communityAPI.deletePost(id);
      console.log("게시물 삭제 API 응답:", response.data);
      
      if (response.data.success) {
        alert("게시물이 삭제되었습니다.");
        console.log("게시물 삭제 완료, 커뮤니티로 이동");
        navigate("/community");
      } else {
        console.error("게시물 삭제 실패:", response.data.message);
        alert("게시물 삭제에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("게시물 삭제 에러:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      
      if (error.response?.status === 403) {
        alert("게시물을 삭제할 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("게시물을 찾을 수 없습니다.");
      } else {
        alert("게시물 삭제에 실패했습니다: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setDeletingPost(false);
    }
  };

  const handleEditPost = () => {
    navigate(`/community/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="게시물" showBack={true} onBack={() => navigate("/community")} />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="게시물" showBack={true} onBack={() => navigate("/community")} />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-gray-500 mb-4">게시물을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/community")}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 임시 디버깅
  console.log("PostDetail 디버깅:");
  console.log("현재 사용자:", user);
  console.log("게시물 작성자:", post.userId);
  console.log("user?.id:", user?.id);
  console.log("user?._id:", user?._id);
  console.log("post.userId?._id:", post.userId?._id);
  
  const isAuthor = user && post.userId && (
    String(user.id || user._id) === String(post.userId._id || post.userId.id || post.userId)
  );
  
  console.log("PostDetail isAuthor 결과:", isAuthor);
  
  const isLiked = post.likes?.includes(user?.id);
  const likeCount = post.likes?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="게시물" showBack={true} onBack={() => navigate("/community")} />
      
      <div className="bg-white">
        {/* 게시물 헤더 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center">
                {post.userId?.profileImage ? (
                  <img
                    src={post.userId.profileImage}
                    alt={post.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {post.userId?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {post.userId?.name || "익명"}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
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
                  onClick={handleEditPost}
                  disabled={deletingPost}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors disabled:opacity-50"
                  title="수정"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={deletingPost}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="삭제"
                >
                  {deletingPost ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 게시물 내용 */}
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            {post.title}
          </h1>
          
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 미디어 */}
          {post.mediaUrl && (
            <div className="mt-4">
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
                    className="w-full rounded-lg"
                    onLoad={(e) => {
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
                        <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="18">
                            🖼️ 이미지를 불러올 수 없습니다
                          </text>
                          <text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
                            ${post.title || '제목 없음'}
                          </text>
                        </svg>
                      `)}`;
                      
                      // onError 이벤트 제거하여 무한 루프 방지
                      e.target.onerror = null;
                    }}
                  />
                  
                  {/* 이미지 로드 실패 시 대체 UI */}
                  <div className="image-fallback w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">이미지를 불러올 수 없습니다</p>
                    </div>
                  </div>
                </div>
              )}
              {post.mediaType === 'video' && (
                <video
                  src={post.mediaUrl.startsWith('http') ? post.mediaUrl : `http://localhost:8080${post.mediaUrl}`}
                  controls
                  className="w-full rounded-lg"
                />
              )}
            </div>
          )}

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-rose-50 text-rose-600 text-sm rounded-full border border-rose-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 액션 바 */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg
                  className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`}
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
                <span className="font-medium">{likeCount}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">{post.comments?.length || 0}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">{post.viewCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-4 bg-white">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">댓글 {post.comments?.length || 0}</h3>
        </div>

        {/* 댓글 작성 폼 */}
        {user && (
          <form onSubmit={handleCommentSubmit} className="px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || submittingComment}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "등록"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 댓글 목록 */}
        <div className="divide-y divide-gray-200">
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => {
              const isCommentAuthor = user && comment.userId && (
                String(user.id || user._id) === String(comment.userId._id || comment.userId.id || comment.userId)
              );
              
              // 댓글 작성자 디버깅
              console.log("댓글 작성자 확인:", {
                user: user,
                commentUserId: comment.userId,
                isCommentAuthor: isCommentAuthor
              });
              return (
                <div key={comment._id} className="px-4 py-3">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                      {comment.userId?.profileImage ? (
                        <img
                          src={comment.userId.profileImage}
                          alt={comment.userId.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {comment.userId?.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {comment.userId?.name || "익명"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        {isCommentAuthor && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="댓글 삭제"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-gray-800 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              아직 댓글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
