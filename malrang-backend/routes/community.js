// routes/community.js
// 커뮤니티 관련 API 라우트

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/posts");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("지원되지 않는 파일 형식입니다."));
    }
  }
});

// 게시물 목록 조회
router.get("/posts", async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "recent" } = req.query;
    const skip = (page - 1) * limit;
    
    let sortOption = { createdAt: -1 };
    if (sort === "popular") {
      sortOption = { likes: -1, createdAt: -1 };
    }
    
    const posts = await Post.find({ isPublic: true })
      .populate("userId", "name email profileImage")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({ isPublic: true });
    
    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNext: skip + posts.length < totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "게시물을 불러오는데 실패했습니다.",
      error: error.message
    });
  }
});

// 게시물 상세 조회
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "name email profileImage")
      .populate("comments.userId", "name profileImage");
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    // 조회수 증가
    post.viewCount += 1;
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "게시물을 불러오는데 실패했습니다.",
      error: error.message
    });
  }
});

// 게시물 작성
router.post("/posts", auth, upload.single("media"), async (req, res) => {
  try {
    const { title, content, tags, mediaType } = req.body;
    
    const postData = {
      userId: req.user.userId, // req.user.id에서 req.user.userId로 수정
      title,
      content,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : []
    };
    
    if (req.file) {
      postData.mediaUrl = `/uploads/posts/${req.file.filename}`;
      postData.mediaType = mediaType || "image";
    }
    
    const post = new Post(postData);
    await post.save();
    
    await post.populate("userId", "name email profileImage");
    
    res.status(201).json({
      success: true,
      message: "게시물이 작성되었습니다.",
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "게시물 작성에 실패했습니다.",
      error: error.message
    });
  }
});

// 게시물 수정
router.put("/posts/:id", auth, upload.single("media"), async (req, res) => {
  try {
    const { title, content, tags, mediaType } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    if (post.userId.toString() !== req.user.userId) { // req.user.id에서 req.user.userId로 수정
      return res.status(403).json({
        success: false,
        message: "게시물을 수정할 권한이 없습니다."
      });
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags ? tags.split(",").map(tag => tag.trim()) : post.tags;
    
    if (req.file) {
      // 기존 파일 삭제
      if (post.mediaUrl) {
        const oldFilePath = path.join(__dirname, "..", post.mediaUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      post.mediaUrl = `/uploads/posts/${req.file.filename}`;
      post.mediaType = mediaType || "image";
    }
    
    await post.save();
    await post.populate("userId", "name email profileImage");
    
    res.json({
      success: true,
      message: "게시물이 수정되었습니다.",
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "게시물 수정에 실패했습니다.",
      error: error.message
    });
  }
});

// 게시물 삭제
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    // 권한 확인
    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "게시물을 삭제할 권한이 없습니다."
      });
    }
    
    // 첨부 파일 삭제
    if (post.mediaUrl) {
      const filePath = path.join(__dirname, "..", post.mediaUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: "게시물이 삭제되었습니다."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "게시물 삭제에 실패했습니다.",
      error: error.message
    });
  }
});

// 좋아요 토글
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    const userId = req.user.userId; // req.user.id에서 req.user.userId로 수정
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.json({
      success: true,
      message: isLiked ? "좋아요를 취소했습니다." : "좋아요를 눌렀습니다.",
      data: {
        isLiked: !isLiked,
        likeCount: post.likes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "좋아요 처리에 실패했습니다.",
      error: error.message
    });
  }
});

// 댓글 작성
router.post("/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    const comment = {
      userId: req.user.userId, // req.user.id에서 req.user.userId로 수정
      content
    };
    
    post.comments.push(comment);
    await post.save();
    
    await post.populate("comments.userId", "name profileImage");
    const newComment = post.comments[post.comments.length - 1];
    
    res.status(201).json({
      success: true,
      message: "댓글이 작성되었습니다.",
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "댓글 작성에 실패했습니다.",
      error: error.message
    });
  }
});

// 댓글 삭제
router.delete("/posts/:postId/comments/:commentId", auth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    console.log("댓글 삭제 요청:", { postId, commentId, userId: req.user.userId });
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다."
      });
    }
    
    const comment = post.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다."
      });
    }
    
    // 권한 확인
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "댓글을 삭제할 권한이 없습니다."
      });
    }
    
    // Mongoose 6+ 버전에서는 pull() 메소드 사용
    post.comments.pull(commentId);
    await post.save();
    
    res.json({
      success: true,
      message: "댓글이 삭제되었습니다."
    });
  } catch (error) {
    console.error("댓글 삭제 에러:", error);
    res.status(500).json({
      success: false,
      message: "댓글 삭제에 실패했습니다.",
      error: error.message
    });
  }
});

module.exports = router;
