import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Video,
  FileText,
  MoreHorizontal,
  ArrowLeft,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/router";

const CommunityPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const fileInputRef = useRef(null);

  // 뒤로가기 함수
  const handleGoBack = () => {
    router.push("/mypage");
  };

  // 커뮤니티 게시물 데이터
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "어린이병원 기부 후기",
      description:
        "룰렛으로 3,500원이 나와서 어린이병원에 기부했어요. 작은 금액이지만 아이들에게 도움이 되었으면 좋겠습니다. 앞으로도 꾸준히 기부할 예정입니다.",
      author: "마음씨",
      avatar: "😊",
      time: "2시간 전",
      type: "photo",
      emoji: "🏥",
      likes: 24,
      comments: 8,
      isLiked: false,
      tags: ["의료지원", "어린이"],
      image: "/images/Gemini_Generated_Image_ (1).png",
      fullDescription:
        "룰렛으로 3,500원이 나와서 어린이병원에 기부했어요. 작은 금액이지만 아이들에게 도움이 되었으면 좋겠습니다. 앞으로도 꾸준히 기부할 예정입니다.\n\n기부를 통해 아이들의 건강한 미래를 응원하고 싶었어요. 병원 관계자분들께서도 정말 감사해하시더라구요. 이런 작은 실천들이 모여서 큰 변화를 만들어갈 수 있다고 믿습니다.\n\n앞으로도 꾸준히 기부하고, 주변 사람들에게도 기부의 중요성을 알리는 일을 하고 싶어요. 함께 따뜻한 세상을 만들어가요! 💕",
      commentsList: [
        {
          id: 1,
          author: "따뜻한마음",
          avatar: "💝",
          content:
            "정말 감동적인 기부 이야기네요! 작은 금액도 모이면 큰 도움이 되죠.",
          time: "1시간 전",
          likes: 3,
        },
        {
          id: 2,
          author: "희망이",
          avatar: "🌟",
          content:
            "어린이들을 위한 기부라니 정말 의미있어요. 저도 참여하고 싶어요!",
          time: "30분 전",
          likes: 2,
        },
        {
          id: 3,
          author: "사랑이",
          avatar: "💕",
          content:
            "아이들의 건강한 미래를 응원합니다! 앞으로도 꾸준히 기부하세요.",
          time: "15분 전",
          likes: 1,
        },
      ],
    },
    {
      id: 2,
      title: "고아원 봉사 인증",
      description:
        "기부만으로 부족해서 직접 봉사활동도 다녀왔어요. 아이들이 너무 사랑스럽더라구요 ❤️ 다음 주에도 또 갈 예정입니다.",
      author: "슬기",
      avatar: "🥰",
      time: "5시간 전",
      type: "video",
      emoji: "🐾",
      likes: 87,
      comments: 23,
      isLiked: true,
      tags: ["어린이", "봉사활동"],
      image: "/images/Gemini_Generated_Image_ (2).png",
      fullDescription:
        "기부만으로 부족해서 직접 봉사활동도 다녀왔어요. 아이들이 너무 사랑스럽더라구요 ❤️\n\n고아원에서 아이들을 돌보며 정말 많은 것을 배웠어요. 사랑과 관심만으로도 아이들이 얼마나 행복해지는지 직접 보았어요.\n\n다음 주에도 또 갈 예정이고, 주변 지인들도 함께 데려가서 봉사활동의 즐거움을 나누고 싶어요.\n\n작은 실천이지만 아이들에게는 큰 도움이 된다는 것을 느꼈어요. 함께 더불어 살아가는 세상을 만들어가요! ",
      commentsList: [
        {
          id: 1,
          author: "아이사랑",
          avatar: "🐾",
          content:
            "직접 봉사활동을 다녀오셨다니 정말 대단해요! 아이들이 얼마나 행복했을지 상상이 됩니다.",
          time: "4시간 전",
          likes: 5,
        },
        {
          id: 2,
          author: "따뜻이",
          avatar: "💖",
          content:
            "저도 다음에 함께 가고 싶어요! 봉사활동 경험담을 더 들려주세요.",
          time: "3시간 전",
          likes: 3,
        },
        {
          id: 3,
          author: "희망이",
          avatar: "✨",
          content:
            "작은 실천이 큰 변화를 만들어간다는 말이 정말 맞는 것 같아요. 감동받았습니다!",
          time: "2시간 전",
          likes: 2,
        },
      ],
    },
    {
      id: 3,
      title: "환경보호 캠페인 참여 후기",
      description:
        "환경보호단체 기부 후 받은 감사 편지와 활동 자료를 공유합니다. 지구를 위해 함께해요! 작은 행동이 큰 변화를 만들어갑니다.",
      author: "지혜",
      avatar: "🌱",
      time: "1일 전",
      type: "document",
      emoji: "🌍",
      likes: 156,
      comments: 45,
      isLiked: false,
      tags: ["환경보호", "캠페인"],
      image: "/images/Gemini_Generated_Image_ (3).png",
      fullDescription:
        "환경보호단체 기부 후 받은 감사 편지와 활동 자료를 공유합니다. 지구를 위해 함께해요!\n\n기부한 금액으로 해양 정화 활동과 산림 보호 캠페인이 진행되었다고 해요. 직접 참여하지 못했지만, 기부를 통해 환경보호에 기여할 수 있어서 정말 뿌듯했어요.\n\n받은 자료를 보니 우리가 생각했던 것보다 훨씬 체계적이고 효과적인 활동들이 진행되고 있었어요. 특히 해양 플라스틱 문제와 기후변화 대응에 대한 구체적인 계획들이 인상적이었습니다.\n\n앞으로도 환경보호를 위한 기부를 꾸준히 하고, 일상생활에서도 플라스틱 사용을 줄이고 분리수거를 철저히 하는 등 작은 실천들을 이어가고 싶어요. 지구를 위한 작은 행동이 모여 큰 변화를 만들어갈 수 있다고 믿어요! 🌿🌊",
      commentsList: [
        {
          id: 1,
          author: "지구사랑",
          avatar: "🌍",
          content:
            "환경보호를 위한 기부라니 정말 의미있어요! 지구를 위한 작은 실천들이 모여 큰 변화를 만들어갈 거예요.",
          time: "23시간 전",
          likes: 8,
        },
        {
          id: 2,
          author: "자연이",
          avatar: "🌿",
          content:
            "해양 정화 활동과 산림 보호 캠페인이라니 구체적이고 체계적이네요. 저도 참여하고 싶어요!",
          time: "22시간 전",
          likes: 6,
        },
        {
          id: 3,
          author: "미래이",
          avatar: "🔮",
          content:
            "기후변화 대응 계획까지 있다니 정말 체계적이에요. 앞으로도 환경보호 기부를 꾸준히 하세요!",
          time: "21시간 전",
          likes: 4,
        },
      ],
    },
    {
      id: 4,
      title: "독거어르신 도시락 배달",
      description:
        "기부한 곳에서 봉사활동 기회를 주셔서 직접 도시락 배달을 했어요. 어르신들이 너무 반가워해주셨답니다.",
      author: "따뜻이",
      avatar: "👵",
      time: "2일 전",
      type: "photo",
      emoji: "🍱",
      likes: 92,
      comments: 31,
      isLiked: false,
      tags: ["어르신지원", "봉사활동"],
      image: "/images/Gemini_Generated_Image_ (4).png",
      fullDescription:
        '기부한 곳에서 봉사활동 기회를 주셔서 직접 도시락 배달을 했어요. 어르신들이 너무 반가워해주셨답니다.\n\n처음에는 어색하고 긴장했지만, 어르신들의 따뜻한 환대에 금방 편안해졌어요. 각각의 어르신들이 모두 다른 이야기와 인생 경험을 가지고 계셨고, 그 이야기들을 들으면서 정말 많은 것을 배웠어요.\n\n특히 90세가 넘으신 할머니께서는 젊은 시절의 이야기를 들려주시며 "너도 꼭 좋은 사람이 되어라"고 말씀해주셨어요. 그 순간 정말 감동적이었고, 봉사활동의 의미를 새롭게 깨달았어요.\n\n도시락을 받으시는 어르신들의 미소가 정말 아름다웠어요. 작은 정성이지만 어르신들에게는 큰 위로가 되었다는 것을 느꼈어요. 앞으로도 꾸준히 봉사활동에 참여하고 싶어요! 👴👵💝',
      commentsList: [
        {
          id: 1,
          author: "어르신사랑",
          avatar: "👴",
          content:
            "어르신들을 위한 봉사활동이라니 정말 따뜻하네요. 어르신들의 미소가 상상이 됩니다.",
          time: "1일 전",
          likes: 7,
        },
        {
          id: 2,
          author: "따뜻한마음",
          avatar: "💝",
          content:
            "90세 할머니의 이야기를 들을 수 있었다니 정말 특별한 경험이었겠어요. 인생의 지혜를 배울 수 있었겠네요.",
          time: "23시간 전",
          likes: 5,
        },
        {
          id: 3,
          author: "희망이",
          avatar: "🌟",
          content:
            "작은 정성이지만 어르신들에게는 큰 위로가 된다는 말이 정말 맞아요. 앞으로도 꾸준히 봉사활동에 참여하세요!",
          time: "22시간 전",
          likes: 3,
        },
      ],
    },
    {
      id: 5,
      title: "교육재단 장학금 전달식",
      description:
        "5,000원 기부가 모여서 장학금이 되었다는 소식을 들었어요. 작은 정성이 큰 변화를 만드네요.",
      author: "희망이",
      avatar: "📚",
      time: "3일 전",
      type: "video",
      emoji: "🎓",
      likes: 203,
      comments: 67,
      isLiked: true,
      tags: ["교육지원", "장학금"],
      image: "/images/Gemini_Generated_Image_ (5).png",
      fullDescription:
        '5,000원 기부가 모여서 장학금이 되었다는 소식을 들었어요. 작은 정성이 큰 변화를 만드네요.\n\n장학금 전달식에 참석할 수 있어서 정말 영광이었어요. 장학금을 받은 학생들의 눈빛이 정말 밝고 희망에 가득했어요. 그 순간 기부의 진정한 의미를 깨달았어요.\n\n특히 한 학생이 "이 장학금 덕분에 꿈을 이룰 수 있게 되었습니다"라고 말씀하실 때 정말 뿌듯했어요. 우리의 작은 기부가 누군가의 꿈을 이루는 데 도움이 되었다는 것이 믿기지 않았어요.\n\n교육은 미래를 바꾸는 가장 강력한 도구라고 생각해요. 앞으로도 교육 지원을 위한 기부를 꾸준히 하고, 더 많은 학생들이 꿈을 이룰 수 있도록 도움을 주고 싶어요. 함께 밝은 미래를 만들어가요! 🎓✨',
      commentsList: [
        {
          id: 1,
          author: "교육사랑",
          avatar: "📖",
          content:
            "장학금 전달식에 참석할 수 있었다니 정말 영광이었겠어요! 학생들의 밝은 눈빛을 직접 보셨다니 감동적이네요.",
          time: "2일 전",
          likes: 12,
        },
        {
          id: 2,
          author: "미래이",
          avatar: "🔮",
          content:
            "작은 기부가 누군가의 꿈을 이루는 데 도움이 되었다니 정말 의미있어요. 교육은 미래를 바꾸는 가장 강력한 도구죠!",
          time: "2일 전",
          likes: 9,
        },
        {
          id: 3,
          author: "희망이",
          avatar: "✨",
          content:
            "함께 밝은 미래를 만들어간다는 말이 정말 아름다워요. 앞으로도 교육 지원을 위한 기부를 꾸준히 하세요!",
          time: "1일 전",
          likes: 6,
        },
      ],
    },
    {
      id: 6,
      title: "의료봉사단 해외 활동 소식",
      description:
        "의료봉사단에서 보내준 해외 활동 보고서예요. 우리 기부금이 정말 의미있게 쓰이고 있어요!",
      author: "나눔이",
      avatar: "⚕️",
      time: "4일 전",
      type: "document",
      emoji: "🌍",
      likes: 134,
      comments: 28,
      isLiked: false,
      tags: ["의료지원", "해외봉사"],
      image: "/images/Gemini_Generated_Image_ (6).png",
      fullDescription:
        '의료봉사단에서 보내준 해외 활동 보고서예요. 우리 기부금이 정말 의미있게 쓰이고 있어요!\n\n보고서를 읽어보니 우리가 기부한 금액으로 아프리카와 동남아시아 지역의 의료 지원이 활발하게 진행되고 있었어요. 특히 의료 시설이 부족한 지역에 의료진을 파견하고, 필요한 의료 장비를 지원하는 활동들이 인상적이었어요.\n\n가장 감동적이었던 것은 현지 주민들의 감사 인사였어요. "한국에서 온 도움 덕분에 아이들이 건강하게 자랄 수 있게 되었습니다"라는 메시지를 보면서 기부의 진정한 가치를 느꼈어요.\n\n의료는 모든 사람의 기본권이라고 생각해요. 앞으로도 의료 지원을 위한 기부를 꾸준히 하고, 더 많은 사람들이 건강한 삶을 살 수 있도록 도움을 주고 싶어요. 함께 건강한 세상을 만들어가요! 🏥💊',
    },
  ]);

  // 게시글 클릭 시 팝업 열기
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  // 팝업 닫기
  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
    setCommentText("");
    setReplyingTo(null);
  };

  // 댓글 관련 상태
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // 댓글 추가 함수
  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: "나",
      avatar: "😊",
      content: commentText,
      time: "방금 전",
      likes: 0,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [...(post.commentsList || []), newComment],
            }
          : post
      )
    );

    setCommentText("");
    setReplyingTo(null);
  };

  // 댓글 좋아요 토글
  const toggleCommentLike = (postId, commentId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsList: post.commentsList.map((comment) =>
                comment.id === commentId
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("파일 크기는 50MB를 초과할 수 없습니다.");
        return;
      }
      setUploadedFile(file);
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const handlePostSubmit = () => {
    // 폼 제출 로직은 버튼 onClick에서 처리
  };

  const toggleLike = (postId) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const filteredPosts =
    filter === "all" ? posts : posts.filter((post) => post.type === filter);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") {
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
            <h1 className="text-lg font-bold text-pink-900">Malrang</h1>
            <p className="text-sm text-pink-600">
              따뜻한 기부 이야기를 나누세요
            </p>
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
            <h2 className="text-xl font-bold text-pink-900 mb-2">
              내 기부 이야기 공유하기
            </h2>
            <p className="text-pink-700 mb-6 text-sm leading-relaxed">
              사진, 영상, 자료를 통해 여러분의 따뜻한 기부 경험을
              <br />
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
                { id: "all", label: "전체", icon: "🏠" },
                { id: "photo", label: "사진", icon: "📷" },
                { id: "video", label: "영상", icon: "🎥" },
                { id: "document", label: "자료", icon: "📄" },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filter === id
                      ? "bg-primary-500 text-white shadow-lg transform scale-105"
                      : "bg-white text-pink-700 border border-pink-200 hover:border-primary-400 hover:text-primary-600"
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
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-pink-200 cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              {/* 미디어 영역 */}
              <div className="h-52 bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* 기본 배경 이미지 */}
                    <img
                      src="/images/default-bg.jpg"
                      alt="기본 배경"
                      className="w-full h-full object-cover opacity-30"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span className="text-5xl relative z-10">{post.emoji}</span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-200/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-pink-700 px-3 py-1 rounded-full text-xs font-medium border border-pink-200">
                  {post.type === "photo"
                    ? "📷 사진"
                    : post.type === "video"
                    ? "🎥 영상"
                    : "📄 자료"}
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
                      <span className="font-semibold text-pink-900">
                        {post.author}
                      </span>
                      <span className="text-pink-400">•</span>
                      <span className="text-sm text-pink-600">{post.time}</span>
                    </div>
                    <h3 className="font-bold text-pink-900 mb-2 text-lg leading-tight">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <p className="text-pink-700 text-sm mb-4 leading-relaxed">
                  {post.description}
                </p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-700 px-2 py-1 rounded-lg text-xs border border-pink-200"
                    >
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
                          ? "text-primary-500 bg-primary-100 border border-primary-300"
                          : "text-pink-600 hover:bg-pink-100 hover:text-primary-600 border border-pink-200"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={post.isLiked ? "fill-current" : ""}
                      />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full text-pink-600 hover:bg-pink-100 hover:text-primary-600 transition-colors border border-pink-200">
                      <MessageCircle size={18} />
                      <span className="text-sm font-medium">
                        {post.comments}
                      </span>
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
                <h2 className="text-xl font-bold text-pink-900">
                  새 게시물 작성
                </h2>
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
                className="border-2 border-dashed border-primary-400 rounded-2xl p-8 text-center mb-6 cursor-pointer hover:bg-pink-50 transition-colors"
              >
                <div className="text-4xl mb-4">📁</div>
                <div className="text-pink-700 mb-2 font-medium">
                  파일을 선택하거나 드래그해서 업로드하세요
                </div>
                <div className="text-pink-600 text-sm">
                  JPG, PNG, MP4, PDF 파일 지원 (최대 50MB)
                </div>
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
                <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center shadow-sm">
                      {uploadedFile.type.startsWith("image/") ? (
                        <Camera size={20} className="text-primary-500" />
                      ) : uploadedFile.type.startsWith("video/") ? (
                        <Video size={20} className="text-accent-500" />
                      ) : (
                        <FileText size={20} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-pink-900">
                        {uploadedFile.name}
                      </div>
                      <div className="text-pink-600 text-xs">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors border border-red-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* 입력 폼 */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-pink-900 mb-3">
                    제목
                  </label>
                  <input
                    id="postTitle"
                    type="text"
                    placeholder="게시물 제목을 입력하세요"
                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors bg-white text-pink-900 placeholder-pink-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-pink-900 mb-3">
                    내용
                  </label>
                  <textarea
                    id="postContent"
                    placeholder="기부 경험이나 소감을 자유롭게 작성해주세요"
                    rows="4"
                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-primary-400 focus:outline-none resize-none transition-colors bg-white text-pink-900 placeholder-pink-400"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadedFile(null);
                    }}
                    className="flex-1 py-4 border-2 border-pink-200 rounded-xl text-pink-600 font-medium hover:bg-pink-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const title = document.getElementById("postTitle").value;
                      const content =
                        document.getElementById("postContent").value;

                      if (!title.trim()) {
                        alert("제목을 입력해주세요.");
                        return;
                      }

                      if (!uploadedFile) {
                        alert("파일을 선택해주세요.");
                        return;
                      }

                      const newPost = {
                        id: posts.length + 1,
                        title,
                        description:
                          content || "사용자가 업로드한 콘텐츠입니다.",
                        author: "나",
                        avatar: "😊",
                        time: "방금 전",
                        type: getFileType(uploadedFile),
                        emoji: "💕",
                        likes: 0,
                        comments: 0,
                        isLiked: false,
                        tags: ["새글"],
                      };

                      setPosts([newPost, ...posts]);
                      setShowUploadModal(false);
                      setUploadedFile(null);
                      document.getElementById("postTitle").value = "";
                      document.getElementById("postContent").value = "";

                      alert("게시물이 성공적으로 업로드되었습니다!");
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

      {/* 게시글 클릭 시 팝업 */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-pink-200 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-pink-900">
                  {selectedPost.title}
                </h2>
                <button
                  onClick={handleClosePostModal}
                  className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 게시글 내용 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {selectedPost.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-pink-900">
                        {selectedPost.author}
                      </span>
                      <span className="text-pink-400">•</span>
                      <span className="text-sm text-pink-600">
                        {selectedPost.time}
                      </span>
                      <span className="text-pink-400">•</span>
                      <span className="text-xs text-pink-500 bg-pink-100 px-2 py-1 rounded-full">
                        {selectedPost.type === "photo"
                          ? "📷 사진"
                          : selectedPost.type === "video"
                          ? "🎥 영상"
                          : "📄 자료"}
                      </span>
                    </div>
                    <h3 className="font-bold text-pink-900 mb-2 text-lg leading-tight">
                      {selectedPost.title}
                    </h3>
                  </div>
                </div>

                {/* 게시글 이미지 */}
                {selectedPost.image && (
                  <div className="w-full rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-pink-700 text-base leading-relaxed font-medium">
                    {selectedPost.description}
                  </p>
                  {selectedPost.fullDescription && (
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-2xl border border-pink-200">
                      <p className="text-pink-700 text-sm leading-relaxed whitespace-pre-line">
                        {selectedPost.fullDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-700 px-3 py-2 rounded-full text-sm border border-pink-200 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 상호작용 버튼 */}
                <div className="flex items-center justify-between pt-6 border-t border-pink-200 mt-6">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleLike(selectedPost.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        selectedPost.isLiked
                          ? "text-primary-500 bg-primary-100 border border-primary-300"
                          : "text-pink-600 hover:bg-pink-100 hover:text-primary-600 border border-pink-200"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={selectedPost.isLiked ? "fill-current" : ""}
                      />
                      <span className="text-sm font-medium">
                        {selectedPost.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-pink-600 hover:bg-pink-100 hover:text-primary-600 transition-colors border border-pink-200">
                      <MessageCircle size={18} />
                      <span className="text-sm font-medium">
                        {selectedPost.comments}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-pink-600 hover:bg-pink-100 hover:text-primary-600 transition-colors border border-pink-200">
                      <Share2 size={18} />
                      <span className="text-sm font-medium">공유</span>
                    </button>
                  </div>
                  <button className="p-2 text-pink-600 hover:bg-pink-100 hover:text-primary-600 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* 댓글 섹션 */}
                <div className="mt-8 border-t border-pink-200 pt-6">
                  <h3 className="text-lg font-bold text-pink-900 mb-4">
                    댓글 {selectedPost.comments}개
                  </h3>

                  {/* 댓글 목록 */}
                  <div className="space-y-4 mb-6">
                    {(selectedPost.commentsList || []).map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-3 p-4 bg-pink-50 rounded-2xl"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-pink-900">
                              {comment.author}
                            </span>
                            <span className="text-sm text-pink-500">
                              {comment.time}
                            </span>
                          </div>
                          <p className="text-pink-700 text-sm leading-relaxed mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                toggleCommentLike(selectedPost.id, comment.id)
                              }
                              className="flex items-center gap-1 text-xs text-pink-600 hover:text-primary-600 transition-colors"
                            >
                              <Heart size={14} />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-xs text-pink-600 hover:text-primary-600 transition-colors">
                              답글
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 댓글 작성 */}
                  <div className="bg-white border border-pink-200 rounded-2xl p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        😊
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="댓글을 작성해주세요..."
                          className="w-full p-3 border border-pink-200 rounded-xl focus:border-primary-400 focus:outline-none resize-none transition-colors text-pink-900 placeholder-pink-400"
                          rows="2"
                        />
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => handleAddComment(selectedPost.id)}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
                          >
                            댓글 작성
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
