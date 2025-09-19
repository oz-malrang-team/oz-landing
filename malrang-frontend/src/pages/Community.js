import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CommunityCard from "../components/CommunityCard";
import UploadModal from "../components/UploadModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MobileHeader from "../components/common/MobileHeader";
import { communityAPI } from "../services/api";

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // 누락된 상태 추가
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const response = await communityAPI.getPosts({
        page: pageNum,
        limit: 20,
        sort: filter
      });
      
      if (response.data.success) {
        const newPosts = response.data.data.posts;
        
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        setHasMore(response.data.data.pagination.hasNext);
      } else {
        throw new Error(response.data.message || "게시물을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("게시물을 불러오는데 실패했습니다:", error);
      setError(error.response?.data?.message || error.message || "게시물을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handleFilterChange = (newFilter) => {
    if (newFilter !== filter) {
      setFilter(newFilter);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  };

  const handlePostSuccess = () => {
    setShowUploadModal(false);
    setEditingPost(null);
    // 첫 페이지부터 다시 로드
    setPage(1);
    fetchPosts(1, false);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowUploadModal(true);
  };

  const handleDeletePost = async (postId) => {
    console.log("게시물 삭제 시도:", postId);
    
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      return;
    }

    try {
      console.log("삭제 API 호출 중...");
      const response = await communityAPI.deletePost(postId);
      console.log("삭제 API 응답:", response.data);
      
      if (response.data.success) {
        setPosts(posts.filter(post => post._id !== postId));
        alert("게시물이 삭제되었습니다.");
        console.log("게시물 삭제 완료");
      } else {
        console.error("삭제 실패:", response.data.message);
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
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await communityAPI.toggleLike(postId);
      if (response.data.success) {
        // 게시물 목록에서 좋아요 상태 업데이트
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? {
                  ...post,
                  likes: response.data.data.isLiked 
                    ? [...post.likes, user.id]
                    : post.likes.filter(id => id !== user.id),
                  likeCount: response.data.data.likeCount
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("좋아요 처리 에러:", error);
    }
  };

  const retry = () => {
    setError(null);
    setPage(1);
    fetchPosts(1, false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="커뮤니티" showBack={false} />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="커뮤니티" showBack={false} />
      
      {/* 필터 바 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange("recent")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "recent"
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => handleFilterChange("popular")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "popular"
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={retry}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 게시물 목록 */}
          <div className="p-4 space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 게시물이 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  첫 번째 게시물을 작성해보세요!
                </p>
                {user && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    글쓰기
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <CommunityCard
                  key={post._id}
                  post={post}
                  onPress={() => navigate(`/community/${post._id}`)}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  onLike={handleLikePost}
                />
              ))
            )}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && posts.length > 0 && (
            <div className="px-4 pb-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-rose-200"
              >
                {loadingMore ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>로딩 중...</span>
                  </div>
                ) : (
                  "더보기"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* 글쓰기 버튼 */}
      {user && (
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors z-10 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {/* 업로드 모달 */}
      <UploadModal
        visible={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setEditingPost(null);
        }}
        onUploadSuccess={handlePostSuccess}
        editingPost={editingPost}
      />
    </div>
  );
};

export default Community;
