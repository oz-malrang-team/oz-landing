// routes/donations.js
// 기부 관련 API 라우트

const express = require('express');
const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const authenticateToken = require('../middleware/auth');
const { generateReceiptId, successResponse, errorResponse } = require('../utils/helpers');

const router = express.Router();

// 기부 내역 조회 (페이지네이션 포함)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, year } = req.query;
    
    const query = { userId: req.user.userId };
    
    // 특정 연도 필터링
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31T23:59:59`);
      query.date = { $gte: startDate, $lte: endDate };
    }

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 기부 내역 조회
    const donations = await Donation.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // 총 개수 조회
    const total = await Donation.countDocuments(query);

    // 총 기부금액 계산
    const totalAmountResult = await Donation.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalAmount = totalAmountResult[0]?.total || 0;

    res.json(successResponse('기부 내역 조회 성공', {
      donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      },
      summary: {
        totalAmount,
        count: total
      }
    }));

  } catch (error) {
    console.error('기부 내역 조회 오류:', error);
    res.status(500).json(errorResponse('기부 내역 조회에 실패했습니다.'));
  }
});

// 연간 기부 통계 (연말정산용)
router.get('/yearly-stats/:year', authenticateToken, async (req, res) => {
  try {
    const { year } = req.params;
    
    // 연도 유효성 검사
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json(errorResponse('올바른 연도를 입력해주세요.'));
    }

    // 월별 기부 통계 조회
    const stats = await Donation.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // 12개월 데이터 생성 (기부가 없는 달은 0으로)
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = stats.find(stat => stat._id === month);
      return {
        month,
        amount: found?.amount || 0,
        count: found?.count || 0
      };
    });

    const totalAmount = stats.reduce((sum, stat) => sum + stat.amount, 0);
    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);

    res.json(successResponse('연간 통계 조회 성공', {
      year: yearNum,
      monthlyStats,
      summary: {
        totalAmount,
        totalCount
      }
    }));

  } catch (error) {
    console.error('연간 통계 조회 오류:', error);
    res.status(500).json(errorResponse('연간 통계 조회에 실패했습니다.'));
  }
});

// 새 기부 생성 (테스트용 - 실제로는 결제 시스템과 연동)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { organization, amount, category = 'general' } = req.body;
    
    // 입력값 검증
    if (!organization || !amount) {
      return res.status(400).json(errorResponse('기부 단체와 금액을 입력해주세요.'));
    }

    if (amount < 1000) {
      return res.status(400).json(errorResponse('최소 기부 금액은 1,000원입니다.'));
    }

    // 영수증 ID 생성
    const receiptId = generateReceiptId();

    // 기부 내역 생성
    const donation = new Donation({
      userId: req.user.userId,
      organization: organization.trim(),
      amount: parseInt(amount),
      category,
      receiptId
    });

    await donation.save();

    res.status(201).json(successResponse('기부가 완료되었습니다.', { donation }));

  } catch (error) {
    console.error('기부 생성 오류:', error);
    res.status(500).json(errorResponse('기부 처리 중 오류가 발생했습니다.'));
  }
});

// 영수증 다운로드
router.get('/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(errorResponse('올바르지 않은 기부 ID입니다.'));
    }

    const donation = await Donation.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!donation) {
      return res.status(404).json(errorResponse('기부 내역을 찾을 수 없습니다.'));
    }

    // 영수증 데이터 생성 (실제로는 PDF 생성 라이브러리 사용)
    const receiptData = {
      receiptId: donation.receiptId,
      date: donation.date.toLocaleDateString('ko-KR'),
      organization: donation.organization,
      amount: donation.amount,
      category: donation.category,
      donorId: req.user.userId
    };

    res.json(successResponse('영수증 다운로드 준비 완료', { receiptData }));

  } catch (error) {
    console.error('영수증 다운로드 오류:', error);
    res.status(500).json(errorResponse('영수증 다운로드에 실패했습니다.'));
  }
});

// 기부 내역 삭제 (관리자용 또는 테스트용)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(errorResponse('올바르지 않은 기부 ID입니다.'));
    }

    const donation = await Donation.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!donation) {
      return res.status(404).json(errorResponse('기부 내역을 찾을 수 없습니다.'));
    }

    res.json(successResponse('기부 내역이 삭제되었습니다.'));

  } catch (error) {
    console.error('기부 내역 삭제 오류:', error);
    res.status(500).json(errorResponse('기부 내역 삭제에 실패했습니다.'));
  }
});

module.exports = router;