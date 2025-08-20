import React, { useState } from 'react';
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle, XCircle, Award, Timer } from 'lucide-react';

const Certification = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30분
  const [examStarted, setExamStarted] = useState(false);

  // 자격증 시험 문제 데이터
  const examQuestions = [
    {
      id: 1,
      question: "기부금 영수증 발급 시 소득공제 혜택을 받을 수 있는 최소 금액은?",
      options: ["1,000원", "5,000원", "10,000원", "20,000원"],
      correctAnswer: 1,
      explanation: "기부금 영수증은 연 5,000원 이상부터 소득공제 혜택을 받을 수 있습니다.",
      category: "기부금 세무"
    },
    {
      id: 2,
      question: "기부금 영수증 발급 기한은 기부일로부터 몇 일 이내인가요?",
      options: ["30일", "60일", "90일", "120일"],
      correctAnswer: 2,
      explanation: "기부금 영수증은 기부일로부터 90일 이내에 발급받아야 합니다.",
      category: "기부금 세무"
    },
    {
      id: 3,
      question: "기부금 소득공제 한도는 연간 총수입금액의 몇 %까지 가능한가요?",
      options: ["10%", "20%", "30%", "40%"],
      correctAnswer: 2,
      explanation: "기부금 소득공제 한도는 연간 총수입금액의 30%까지 가능합니다.",
      category: "기부금 세무"
    },
    {
      id: 4,
      question: "지정기부단체가 아닌 단체에 기부한 경우 기부금 영수증을 발급받을 수 있나요?",
      options: ["발급 가능", "발급 불가", "일정 금액 이상만 가능", "조건부 발급 가능"],
      correctAnswer: 1,
      explanation: "지정기부단체가 아닌 단체에 기부한 경우 기부금 영수증을 발급받을 수 없습니다.",
      category: "기부금 세무"
    },
    {
      id: 5,
      question: "기부금 영수증을 분실한 경우 어떻게 해야 하나요?",
      options: ["재발급 불가", "기부단체에 재발급 요청", "국세청에 재발급 요청", "새로 기부해야 함"],
      correctAnswer: 1,
      explanation: "기부금 영수증을 분실한 경우 기부단체에 재발급을 요청할 수 있습니다.",
      category: "기부금 세무"
    },
    {
      id: 6,
      question: "연말정산 시 기부금 공제 신고는 언제 해야 하나요?",
      options: ["1월 말까지", "2월 말까지", "3월 말까지", "4월 말까지"],
      correctAnswer: 2,
      explanation: "연말정산은 매년 3월 말까지 신고해야 합니다.",
      category: "연말정산"
    },
    {
      id: 7,
      question: "기부금 영수증에 반드시 포함되어야 하는 정보가 아닌 것은?",
      options: ["기부자 성명", "기부 금액", "기부 일자", "기부자 주민등록번호"],
      correctAnswer: 3,
      explanation: "기부자 주민등록번호는 기부금 영수증에 포함되지 않습니다.",
      category: "기부금 세무"
    },
    {
      id: 8,
      question: "기부금 소득공제를 받기 위해 필요한 서류가 아닌 것은?",
      options: ["기부금 영수증", "소득금액증명원", "기부 증빙서류", "기부 동기서"],
      correctAnswer: 3,
      explanation: "기부 동기서는 기부금 소득공제를 받기 위해 필요하지 않습니다.",
      category: "기부금 세무"
    }
  ];

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(1800); // 30분
  };

  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getPassStatus = (score) => {
    const passScore = Math.ceil(examQuestions.length * 0.7); // 70% 이상
    return score >= passScore;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 타이머 효과
  React.useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true);
            setExamStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft]);

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* 헤더 */}
        <div className="bg-gray-800 px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button className="p-2">
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">자격증 시험</h1>
              <p className="text-sm text-gray-400">기부금 영수증 전문가 자격증 시험</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* 시험 안내 */}
          <div className="bg-gray-800 rounded-3xl p-6 mb-6 border border-gray-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">기부금 영수증 전문가 자격증 시험</h2>
              <p className="text-gray-300 mb-6 text-lg">
                기부금 영수증과 관련된 전문 지식을 테스트하는 시험입니다
              </p>
            </div>

            {/* 시험 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-2xl text-center border border-gray-600">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="text-white font-bold text-lg">{examQuestions.length}문제</div>
                <div className="text-gray-400 text-sm">총 문제 수</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl text-center border border-gray-600">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Timer size={24} className="text-white" />
                </div>
                <div className="text-white font-bold text-lg">30분</div>
                <div className="text-gray-400 text-sm">제한 시간</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl text-center border border-gray-600">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target size={24} className="text-white" />
                </div>
                <div className="text-white font-bold text-lg">70%</div>
                <div className="text-gray-400 text-sm">합격 기준</div>
              </div>
            </div>

            {/* 시험 규칙 */}
            <div className="bg-gray-700 p-4 rounded-2xl mb-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">시험 규칙</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 시험 시작 후 중단할 수 없습니다</li>
                <li>• 제한 시간 내에 모든 문제를 풀어야 합니다</li>
                <li>• 답안을 변경할 수 있습니다</li>
                <li>• 70% 이상 정답 시 합격입니다</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-shadow"
            >
              시험 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const isPass = getPassStatus(score);
    const passScore = Math.ceil(examQuestions.length * 0.7);

    return (
      <div className="min-h-screen bg-gray-900">
        {/* 헤더 */}
        <div className="bg-gray-800 px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button className="p-2">
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">시험 결과</h1>
              <p className="text-sm text-gray-400">기부금 영수증 전문가 자격증 시험 결과</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* 결과 카드 */}
          <div className="bg-gray-800 rounded-3xl p-6 mb-6 border border-gray-700">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isPass ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-red-500 to-pink-500'
              }`}>
                {isPass ? (
                  <Award size={48} className="text-white" />
                ) : (
                  <XCircle size={48} className="text-white" />
                )}
              </div>
              
              <h2 className={`text-2xl font-bold mb-2 ${
                isPass ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPass ? '축하합니다! 합격입니다!' : '아쉽습니다. 불합격입니다.'}
              </h2>
              
              <p className="text-gray-300 mb-6">
                {isPass ? '기부금 영수증 전문가 자격을 획득했습니다.' : '다시 한 번 도전해보세요.'}
              </p>

              {/* 점수 정보 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-2xl border border-gray-600">
                  <div className="text-2xl font-bold text-white mb-1">{score}</div>
                  <div className="text-gray-400 text-sm">정답 수</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-2xl border border-gray-600">
                  <div className="text-2xl font-bold text-white mb-1">{Math.round((score / examQuestions.length) * 100)}%</div>
                  <div className="text-gray-400 text-sm">정답률</div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-2xl mb-6 border border-gray-600">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">합격 기준</div>
                  <div className="text-lg font-bold text-white">{passScore}문제 이상 ({Math.round((passScore / examQuestions.length) * 100)}%)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowResults(false);
                  setSelectedAnswers({});
                  setCurrentQuestion(0);
                  setExamStarted(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-shadow"
              >
                다시 시험보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = examQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gray-800 px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">자격증 시험</h1>
            <p className="text-sm text-gray-400">기부금 영수증 전문가 자격증 시험</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-red-400 font-medium">
            <Timer size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* 진행률 표시 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">진행률</span>
            <span className="text-sm text-white">{currentQuestion + 1} / {examQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 문제 카드 */}
        <div className="bg-gray-800 rounded-3xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-pink-400 text-sm font-medium">문제 {currentQ.id}</span>
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
              {currentQ.category}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* 답안 선택 */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 ${
                  selectedAnswers[currentQ.id] === index
                    ? 'border-pink-500 bg-pink-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQ.id] === index
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswers[currentQ.id] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    selectedAnswers[currentQ.id] === index
                      ? 'text-pink-400'
                      : 'text-gray-300'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="flex-1 py-4 bg-gray-700 text-gray-300 rounded-2xl font-medium hover:bg-gray-600 transition-colors border border-gray-600"
            >
              이전 문제
            </button>
          )}
          
          {currentQuestion < examQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
            >
              다음 문제
            </button>
          ) : (
            <button
              onClick={() => setShowResults(true)}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
            >
              시험 완료
            </button>
          )}
        </div>

        {/* 답안 선택 현황 */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">답안 선택 현황</h3>
          <div className="grid grid-cols-4 gap-2">
            {examQuestions.map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium border-2 ${
                  selectedAnswers[examQuestions[index].id] !== undefined
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-gray-700 text-gray-400 border-gray-600'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification; 