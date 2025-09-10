const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const { authenticateToken } = require('../middleware/auth');

const successResponse = (message, data = null) => ({
  success: true,
  message,
  data
});

const errorResponse = (message, error = null) => ({
  success: false,
  message,
  error
});

router.get('/faq', async (req, res) => {
  try {
    const testFaqs = [
      {
        _id: '507f1f77bcf86cd799439015',
        subject: '기부금 영수증은 어떻게 발급받을 수 있나요?',
        content: '기부금 영수증 발급 방법이 궁금합니다.',
        category: 'donation',
        adminResponse: {
          content: '기부금 영수증은 마이페이지의 기부 내역에서 직접 발급받으실 수 있습니다. 연말정산 시 필요한 기부금 영수증은 국세청 연말정산 간소화 서비스에 자동 등록되므로, 별도로 제출하지 않으셔도 됩니다.',
          respondedBy: '고객지원팀',
          respondedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        viewCount: 256
      },
      {
        _id: '507f1f77bcf86cd799439016',
        subject: '정기후원 금액을 변경하거나 중단하고 싶어요.',
        content: '정기후원 관리 방법이 궁금합니다.',
        category: 'donation',
        adminResponse: {
          content: '정기후원 금액 변경 및 중단은 마이페이지의 정기후원 관리 메뉴에서 직접 신청하실 수 있습니다. 후원금 변경은 다음 결제일로부터, 중단은 신청 즉시 반영됩니다. 자세한 내용은 고객센터로 문의해 주시면 친절하게 안내해 드리겠습니다.',
          respondedBy: '고객지원팀',
          respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        viewCount: 189
      },
      {
        _id: '507f1f77bcf86cd799439017',
        subject: '나눔가게에서 물품을 판매하고 싶어요.',
        content: '나눔가게 물품 등록 방법이 궁금합니다.',
        category: 'general',
        adminResponse: {
          content: '나눔가게는 개인 간의 물품 나눔과 거래를 지원하는 커뮤니티 공간입니다. 상품을 등록하려면 커뮤니티 페이지에서 글쓰기 버튼을 누른 후, 글쓰기 유형을 나눔가게로 선택해 주세요. 판매 수익금의 일부 또는 전부를 기부할 수 있는 옵션도 제공하고 있습니다.',
          respondedBy: '고객지원팀',
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        viewCount: 142
      },
      {
        _id: '507f1f77bcf86cd799439018',
        subject: '후원한 기부금이 어떻게 사용되는지 궁금해요.',
        content: '기부금 사용 내역을 투명하게 확인하고 싶습니다.',
        category: 'donation',
        adminResponse: {
          content: 'Malrang은 투명한 기부금 운영을 최우선으로 생각합니다. 후원하신 기부금의 사용 내역은 각 캠페인의 임팩트 리포트에서 자세히 확인하실 수 있습니다. 또한, 정기후원자분들께는 매월 뉴스레터를 통해 기부금의 사용 현황과 변화를 정기적으로 공유해 드립니다.',
          respondedBy: '고객지원팀',
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        viewCount: 298
      }
    ];

    return res.json(successResponse('FAQ 목록 조회 성공', { faqs: testFaqs }));

  } catch (error) {
    console.error('FAQ 조회 오류:', error);
    res.status(500).json(errorResponse('FAQ를 불러오는데 실패했습니다.'));
  }
});

module.exports = router;
