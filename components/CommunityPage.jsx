import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Camera, Video, FileText, MoreHorizontal, ArrowLeft, Filter } from 'lucide-react';
import { useRouter } from 'next/router';

const CommunityPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const fileInputRef = useRef(null);

  // 뒤로가기 함수
  const handleGoBack = () => {
    router.push('/mypage');
  };

  // 커뮤니티 게시물 데이터
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '어린이병원 기부 후기',
      description: '룰렛으로 3,500원이 나와서 어린이병원에 기부했어요. 작은 금액이지만 아이들에게 도움이 되었으면 좋겠습니다. 앞으로도 꾸준히 기부할 예정입니다.',
      author: '마음씨',
      avatar: '😊',
      time: '2시간 전',
      type: 'photo',
      emoji: '🏥',
      likes: 24,
      comments: 8,
      isLiked: false,
      tags: ['의료지원', '어린이']
    },
    {
      id: 2,
      title: '유기동물 보호소 봉사 인증',
      description: '기부만으로 부족해서 직접 봉사활동도 다녀왔어요. 아이들이 너무 사랑스럽더라구요 ❤️ 다음 주에도 또 갈 예정입니다.',
      author: '슬기',
      avatar: '🥰',
      time: '5시간 전',
      type: 'video',
      emoji: '🐾',
      likes: 87,
      comments: 23,
      isLiked: true,
      tags: ['동물보호', '봉사활동']
    },
    {
      id: 3,
      title: '환경보호 캠페인 참여 후기',
      description: '환경보호단체 기부 후 받은 감사 편지와 활동 자료를 공유합니다. 지구를 위해 함께해요! 작은 행동이 큰 변화를 만들어갑니다.',
      author: '지혜',
      avatar: '🌱',
      time: '1일 전',
      type: 'document',
      emoji: '🌍',
      likes: 156,
      comments: 45,
      isLiked: false,
      tags: ['환경보호', '캠페인']
    },
    {
      id: 4,
      title: '독거어르신 도시락 배달',
      description: '기부한 곳에서 봉사활동 기회를 주셔서 직접 도시락 배달을 했어요. 어르신들이 너무 반가워해주셨답니다.',
      author: '따뜻이',
      avatar: '👵',
      time: '2일 전',
      type: 'photo',
      emoji: '🍱',
      likes: 92,
      comments: 31,
      isLiked: false,
      tags: ['어르신지원', '봉사활동']
    },
    {
      id: 5,
      title: '교육재단 장학금 전달식',
      description: '5,000원 기부가 모여서 장학금이 되었다는 소식을 들었어요. 작은 정성이 큰 변화를 만드네요.',
      author: '희망이',
      avatar: '📚',
      time: '3일 전',
      type: 'video',
      emoji: '🎓',
      likes: 203,
      comments: 67,
      isLiked: true,
      tags: ['교육지원', '장학금']
    },
    {
      id: 6,
      title: '의료봉사단 해외 활동 소식',
      description: '의료봉사단에서 보내준 해외 활동 보고서예요. 우리 기부금이 정말 의미있게 쓰이고 있어요!',
      author: '나눔이',
      avatar: '⚕️',
      time: '4일 전',
      type: 'document',
      emoji: '🌍',
      likes: 134,
      comments: 28,
      isLiked: false,
      tags: ['의료지원', '해외봉사']
    }
  ]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('파일 크기는 50MB를 초과할 수 없습니다.');
        return;
      }
      setUploadedFile(file);
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'photo';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const handlePostSubmit = () => {
    // 폼 제출 로직은 버튼 onClick에서 처리
  };

  const toggleLike = (postId) => {
    setPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.type === filter);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0; // 기본은 최신순 (이미 정렬됨)
  });

  return (
    <div className="min-h-screen bg-pink-50">
      {/* 헤더 */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-pink-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            title="마이페이지로 이동"
          >
            <ArrowLeft size={20} className="text-pink-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-pink-900">커뮤니티</h1>
            <p className="text-sm text-pink-600">따뜻한 기부 이야기를 나누세요</p>
          </div>
          <button 
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            title="필터"
          >
            <Filter size={20} className="text-pink-600" />
          </button>
        </div>
      </div>

      <div className="pb-6">
        {/* 업로드 섹션 */}
        <div className="bg-gradient-to-br from-white via-pink-50 to-white p-6 m-5 rounded-3xl shadow-lg border border-pink-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-pink-900 mb-2">내 기부 이야기 공유하기</h2>
            <p className="text-pink-700 mb-6 text-sm leading-relaxed">
              사진, 영상, 자료를 통해 여러분의 따뜻한 기부 경험을<br />
              다른 분들과 나누어보세요
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Camera size={18} />
              <span>콘텐츠 업로드하기</span>
            </button>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'all', label: '전체', icon: '🏠' },
                { id: 'photo', label: '사진', icon: '📷' },
                { id: 'video', label: '영상', icon: '🎥' },
                { id: 'document', label: '자료', icon: '📄' }
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filter === id 
                      ? 'bg-primary-500 text-white shadow-lg transform scale-105' 
                      : 'bg-white text-pink-700 border border-pink-200 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-pink-600">
              총 {filteredPosts.length}개의 게시물
            </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-white border border-pink-200 rounded-lg px-3 py-1 text-pink-700 focus:border-primary-400 focus:outline-none"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>

        {/* 게시물 목록 */}
        <div className="px-5 space-y-6">
          {sortedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-pink-200">
              {/* 미디어 영역 */}
              <div className="h-52 bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-200/40 to-transparent"></div>
                <span className="text-5xl relative z-10">{post.emoji}</span>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-pink-700 px-3 py-1 rounded-full text-xs font-medium border border-pink-200">
                  {post.type === 'photo' ? '📷 사진' : post.type === 'video' ? '🎥 영상' : '📄 자료'}
                </div>
              </div>
              
              {/* 콘텐츠 */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-pink-900">{post.author}</span>
                      <span className="text-pink-400">•</span>
                      <span className="text-sm text-pink-600">{post.time}</span>
                    </div>
                    <h3 className="font-bold text-pink-900 mb-2 text-lg leading-tight">{post.title}</h3>
                  </div>
                </div>
                
                <p className="text-pink-700 text-sm mb-4 leading-relaxed">{post.description}</p>
                
                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-lg text-xs border border-pink-200">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 상호작용 버튼 */}
                <div className="flex items-center justify-between pt-3 border-t border-pink-200">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                        post.isLiked 
                          ? 'text-primary-500 bg-primary-100 border border-primary-300' 
                          : 'text-pink-600 hover:bg-pink-100 hover:text-primary-600 border border-pink-200'
                      }`}
                    >
                      <Heart 
                        size={18} 
                        className={post.isLiked ? 'fill-current' : ''} 
                      />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full text-pink-600 hover:bg-pink-100 hover:text-primary-600 transition-colors border border-pink-200">
                      <MessageCircle size={18} />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full text-pink-600 hover:bg-pink-100 hover:text-primary-600 transition-colors border border-pink-200">
                      <Share2 size={18} />
                      <span className="text-sm font-medium">공유</span>
                    </button>
                  </div>
                  <button className="p-2 text-pink-600 hover:bg-pink-100 hover:text-primary-600 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center py-8">
          <button className="bg-white text-primary-500 border-2 border-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-500 hover:text-white transition-colors">
            더 많은 이야기 보기
          </button>
        </div>
      </div>

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto border-t border-pink-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-pink-900">새 게시물 작성</h2>
                <button 
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFile(null);
                  }}
                  className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* 파일 업로드 영역 */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary-400 rounded-2xl p-8 text-center mb-6 cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <div className="text-4xl mb-4">📁</div>
                <div className="text-slate-300 mb-2 font-medium">파일을 선택하거나 드래그해서 업로드하세요</div>
                <div className="text-slate-400 text-sm">JPG, PNG, MP4, PDF 파일 지원 (최대 50MB)</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              {/* 파일 미리보기 */}
              {uploadedFile && (
                <div className="mb-6 p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl border border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center shadow-sm">
                      {uploadedFile.type.startsWith('image/') ? <Camera size={20} className="text-primary-400" /> :
                       uploadedFile.type.startsWith('video/') ? <Video size={20} className="text-accent-400" /> : 
                       <FileText size={20} className="text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white">{uploadedFile.name}</div>
                      <div className="text-slate-400 text-xs">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB
                      </div>
                    </div>
                    <button 
                      onClick={() => setUploadedFile(null)}
                      className="w-8 h-8 bg-red-900/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-800/30 transition-colors border border-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              {/* 입력 폼 */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-white mb-3">제목</label>
                  <input 
                    id="postTitle"
                    type="text" 
                    placeholder="게시물 제목을 입력하세요"
                    className="w-full p-4 border-2 border-slate-600 rounded-xl focus:border-primary-400 focus:outline-none transition-colors bg-slate-700 text-white placeholder-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block font-semibold text-white mb-3">내용</label>
                  <textarea 
                    id="postContent"
                    placeholder="기부 경험이나 소감을 자유롭게 작성해주세요"
                    rows="4"
                    className="w-full p-4 border-2 border-slate-600 rounded-xl focus:border-primary-400 focus:outline-none resize-none transition-colors bg-slate-700 text-white placeholder-slate-400"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadedFile(null);
                    }}
                    className="flex-1 py-4 border-2 border-slate-600 rounded-xl text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const title = document.getElementById('postTitle').value;
                      const content = document.getElementById('postContent').value;
                      
                      if (!title.trim()) {
                        alert('제목을 입력해주세요.');
                        return;
                      }

                      if (!uploadedFile) {
                        alert('파일을 선택해주세요.');
                        return;
                      }

                      const newPost = {
                        id: posts.length + 1,
                        title,
                        description: content || '사용자가 업로드한 콘텐츠입니다.',
                        author: '나',
                        avatar: '😊',
                        time: '방금 전',
                        type: getFileType(uploadedFile),
                        emoji: '💕',
                        likes: 0,
                        comments: 0,
                        isLiked: false,
                        tags: ['새글']
                      };

                      setPosts([newPost, ...posts]);
                      setShowUploadModal(false);
                      setUploadedFile(null);
                      document.getElementById('postTitle').value = '';
                      document.getElementById('postContent').value = '';
                      
                      alert('게시물이 성공적으로 업로드되었습니다!');
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    게시하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;