// create-sample-posts.js
// 샘플 게시물 생성 스크립트

require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
const path = require('path');
const fs = require('fs');

// 데이터베이스 연결
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/malrang');
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

// 샘플 게시물 데이터
const samplePosts = [
  {
    title: "말랑이와 함께하는 즐거운 하루 🌸",
    content: "오늘은 말랑이와 함께 공원에서 산책을 했어요! 따뜻한 햇살 아래에서 보낸 시간이 정말 행복했습니다. 여러분도 좋은 하루 보내세요~",
    tags: ["일상", "산책", "행복", "말랑이"]
  },
  {
    title: "기부의 따뜻함을 나눠요 💕",
    content: "작은 기부라도 누군가에게는 큰 힘이 될 수 있어요. 말랑 룰렛으로 재미있게 기부에 참여해보세요! 함께 만드는 따뜻한 세상이에요.",
    tags: ["기부", "나눔", "사랑", "룰렛"]
  },
  {
    title: "커뮤니티에서 새로운 친구들을 만나요 🤝",
    content: "말랑 커뮤니티에서 다양한 사람들과 소통하고 있어요. 서로의 이야기를 나누고 응원하는 이곳이 정말 좋습니다. 여러분도 함께해요!",
    tags: ["커뮤니티", "소통", "친구", "응원"]
  },
  {
    title: "오늘의 말랑 요리 레시피 🍳",
    content: "말랑이가 좋아하는 특별한 요리를 만들어봤어요! 간단하지만 맛있는 레시피를 공유합니다. 집에서도 쉽게 따라 할 수 있어요~",
    tags: ["요리", "레시피", "맛집", "홈쿡"]
  },
  {
    title: "감사한 마음을 전해요 🙏",
    content: "말랑 프로젝트에 참여해주시는 모든 분들께 진심으로 감사드립니다. 여러분의 따뜻한 마음 덕분에 더 많은 사람들에게 도움을 줄 수 있어요.",
    tags: ["감사", "마음", "프로젝트", "도움"]
  },
  {
    title: "주말에는 말랑이와 휴식을 🛋️",
    content: "바쁜 한 주를 보내고 주말에는 말랑이와 함께 여유로운 시간을 보내고 있어요. 때로는 휴식도 필요하죠. 모두 편안한 주말 보내세요!",
    tags: ["주말", "휴식", "여유", "힐링"]
  }
];

// 메인 함수
const createSamplePosts = async () => {
  try {
    await connectDB();

    // 테스트 사용자 찾기 또는 생성
    let testUser = await User.findOne({ email: 'test@malrang.com' });
    if (!testUser) {
      console.log('테스트 사용자가 없습니다. 새로 생성합니다...');
      testUser = new User({
        email: 'test@malrang.com',
        name: '말랑이',
        password: 'hashedpassword', // 실제로는 해시된 비밀번호
        phone: '010-1234-5678',
        bio: '말랑 커뮤니티의 친구들과 함께해요!'
      });
      await testUser.save();
      console.log('테스트 사용자가 생성되었습니다.');
    }

    // 업로드 폴더의 이미지 파일들 확인
    const uploadsPath = path.join(__dirname, 'uploads', 'posts');
    const imageFiles = fs.readdirSync(uploadsPath)
      .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
      .sort(); // 파일명 순으로 정렬

    console.log('발견된 이미지 파일들:', imageFiles);

    // 기존 게시물 삭제 (선택사항)
    await Post.deleteMany({});
    console.log('기존 게시물들을 삭제했습니다.');

    // 샘플 게시물들 생성
    const createdPosts = [];
    for (let i = 0; i < Math.min(samplePosts.length, imageFiles.length); i++) {
      const postData = {
        userId: testUser._id,
        title: samplePosts[i].title,
        content: samplePosts[i].content,
        tags: samplePosts[i].tags,
        mediaUrl: `/uploads/posts/${imageFiles[i]}`,
        mediaType: 'image',
        isPublic: true,
        viewCount: Math.floor(Math.random() * 100), // 랜덤 조회수
        likes: [], // 빈 좋아요 배열
        comments: [] // 빈 댓글 배열
      };

      const post = new Post(postData);
      await post.save();
      createdPosts.push(post);

      console.log(`게시물 ${i + 1} 생성 완료: ${postData.title}`);
    }

    console.log(`\n총 ${createdPosts.length}개의 샘플 게시물이 생성되었습니다!`);
    console.log('커뮤니티 페이지에서 확인해보세요.');

  } catch (error) {
    console.error('샘플 게시물 생성 중 오류 발생:', error);
  } finally {
    mongoose.disconnect();
    console.log('데이터베이스 연결이 종료되었습니다.');
  }
};

// 스크립트 실행
createSamplePosts(); 