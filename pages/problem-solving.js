import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, BookOpen, Target } from 'lucide-react';

const ProblemSolving = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 샘플 문제 데이터
  const questions = [
    {
      id: 1,
      question: "기부금 영수증 발급 시 소득공제 혜택을 받을 수 있는 최소 금액은?",
      options: ["1,000원", "5,000원", "10,000원", "20,000원"],
      correctAnswer: 1,
      explanation: "기부금 영수증은 연 5,000원 이상부터 소득공제 혜택을 받을 수 있습니다."
    },
    {
      id: 2,
      question: "기부금 영수증 발급 기한은 기부일로부터 몇 일 이내인가요?",
      options: ["30일", "60일", "90일", "120일"],
      correctAnswer: 2,
      explanation: "기부금 영수증은 기부일로부터 90일 이내에 발급받아야 합니다."
    },
    {
      id: 3,
      question: "기부금 소득공제 한도는 연간 총수입금액의 몇 %까지 가능한가요?",
      options: ["10%", "20%", "30%", "40%"],
      correctAnswer: 2,
      explanation: "기부금 소득공제 한도는 연간 총수입금액의 30%까지 가능합니다."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleFinish = () => {
    // 결과 페이지로 이동하거나 초기화
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gray-800 px-5 py-4 shadow-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">문제 풀기</h1>
            <p className="text-sm text-gray-400">기부 관련 문제를 풀어보세요</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* 진행률 표시 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">진행률</span>
            <span className="text-sm text-white">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
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
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* 답안 선택 */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-red-500 bg-red-900/20'
                      : 'border-pink-500 bg-pink-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                } ${
                  showResult && index === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-900/20'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : 'border-pink-500 bg-pink-500'
                      : 'border-gray-400'
                  }`}>
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                    {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                      <XCircle size={16} className="text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correctAnswer
                          ? 'text-green-400'
                          : 'text-red-400'
                        : 'text-pink-400'
                      : 'text-gray-300'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 결과 표시 */}
          {showResult && (
            <div className="mt-6 p-4 bg-gray-700 rounded-2xl border border-gray-600">
              <div className="flex items-center gap-3 mb-3">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircle size={20} className="text-green-400" />
                ) : (
                  <XCircle size={20} className="text-red-400" />
                )}
                <span className={`font-bold ${
                  selectedAnswer === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedAnswer === currentQ.correctAnswer ? '정답입니다!' : '틀렸습니다.'}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-200 ${
                selectedAnswer === null
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
              }`}
            >
              답안 제출
            </button>
          ) : currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
            >
              다음 문제
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
            >
              완료
            </button>
          )}
        </div>

        {/* 점수 표시 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-600">
            <Target size={16} className="text-pink-400" />
            <span className="text-white font-medium">점수: {score} / {questions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolving; 