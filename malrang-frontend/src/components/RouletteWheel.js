import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef, useMemo } from "react";

const RouletteWheel = forwardRef(({ onResult, isSpinning, onSpinningChange }, ref) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);
  const animationRef = useRef(null);

  // 원래 룰렛 상금 배열 (실제 이미지 기준으로 12시 방향부터 시계방향)
  // 실제 룰렛 이미지를 분석하여 정확한 순서로 배치
  const prizes = useMemo(() => [500, 1000, 3000, 5000, 10000], []);

  // 실제 룰렛 이미지의 섹션 배치 (12시 방향을 0도로 하여 시계방향)
  // 포인터가 12시 방향에 고정되어 있으므로, 각 섹션의 중앙각도를 정의
  const sectorCenters = useMemo(() => [
    0,    // 500원 - 12시 방향 (0도)
    72,   // 1000원 - 1시 20분 방향 (72도)  
    144,  // 3000원 - 4시 방향 (144도)
    216,  // 5000원 - 7시 20분 방향 (216도)
    288   // 10000원 - 9시 40분 방향 (288도)
  ], []);

  const spin = useCallback(() => {
    if (isSpinning) return;

    console.log("룰렛 스핀 시작");
    onSpinningChange(true);

    // 가중치를 적용한 랜덤 상금 선택 (작은 금액이 더 자주 나오도록)
    const weights = [40, 25, 15, 12, 8]; // 500원이 40%, 1000원이 25% 등
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    let currentWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        selectedIndex = i;
        break;
      }
    }

    const selectedPrize = prizes[selectedIndex];
    console.log("선택된 상금:", selectedPrize, "인덱스:", selectedIndex);

    // 목표 각도 계산
    // 선택된 섹션의 중앙점이 12시 방향(포인터)에 오도록
    const targetSectorCenter = sectorCenters[selectedIndex];
    
    // 추가 회전 (최소 5바퀴, 최대 8바퀴)
    const extraSpins = 5 + Math.random() * 3;
    const extraRotation = extraSpins * 360;
    
    // 섹터 내에서 랜덤한 위치 (중앙에서 ±15도 범위로 줄임)
    const randomOffset = (Math.random() - 0.5) * 30; // -15도 ~ +15도
    
    // 최종 목표 각도: 선택된 섹션이 12시 방향에 오도록
    // 현재 회전각에서 목표 섹션 중앙이 0도(12시)에 위치하려면
    const targetAngle = 360 - targetSectorCenter + randomOffset;
    const finalRotation = rotation + extraRotation + targetAngle;
    
    console.log("목표 각도 계산:", {
      selectedPrize,
      selectedIndex,
      currentRotation: Math.round(rotation % 360),
      targetSectorCenter,
      extraRotation: Math.round(extraRotation),
      randomOffset: Math.round(randomOffset),
      targetAngle: Math.round(targetAngle),
      finalRotation: Math.round(finalRotation % 360)
    });

    // 애니메이션
    const startTime = Date.now();
    const duration = 3000 + Math.random() * 2000; // 3-5초
    const startRotation = rotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOut cubic 함수로 자연스러운 감속
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (finalRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 스핀 완료 - 실제로 선택된 상금 반환
        console.log("룰렛 스핀 완료, 최종 각도:", currentRotation % 360);
        console.log("당첨 상금:", selectedPrize);
        
        onSpinningChange(false);
        onResult(selectedPrize);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, rotation, onResult, onSpinningChange, prizes, sectorCenters]);

  const stop = useCallback(() => {
    if (!isSpinning) return;
    
    console.log("룰렛 강제 정지");
    
    // 애니메이션 중단
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // 현재 각도에서 실제 결과 계산
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    
    // 포인터(12시 방향)가 가리키는 섹션 찾기
    // 룰렛이 시계방향으로 회전하므로, 포인터 기준으로 역계산
    let selectedIndex = 0;
    let minDistance = Infinity;
    
    // 각 섹션의 중앙점과 포인터(0도) 사이의 거리를 계산
    for (let i = 0; i < sectorCenters.length; i++) {
      // 룰렛 회전을 고려한 실제 섹션 위치
      const actualSectorPosition = (sectorCenters[i] + normalizedAngle) % 360;
      
      // 12시 방향(0도)과의 거리 계산
      let distance = Math.abs(actualSectorPosition - 0);
      if (distance > 180) {
        distance = 360 - distance; // 원형이므로 더 짧은 거리 사용
      }
      
      if (distance < minDistance) {
        minDistance = distance;
        selectedIndex = i;
      }
    }
    
    const selectedPrize = prizes[selectedIndex];
    
    console.log("강제 정지 - 상세 계산:", {
      normalizedAngle: Math.round(normalizedAngle),
      selectedIndex,
      selectedPrize,
      minDistance: Math.round(minDistance),
      sectorPositions: sectorCenters.map((center, i) => ({
        prize: prizes[i],
        center,
        actualPosition: Math.round((center + normalizedAngle) % 360)
      }))
    });
    
    onSpinningChange(false);
    onResult(selectedPrize);
  }, [isSpinning, rotation, onResult, onSpinningChange, prizes, sectorCenters]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    spin,
    stop
  }));

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* 룰렛 컨테이너 - 원형 마스크 적용, 배경 투명화 */}
      <div className="absolute inset-0 rounded-full overflow-hidden bg-transparent">
        {/* 룰렛 판 (회전하는 부분) */}
        <div
          ref={wheelRef}
          className="absolute inset-4 rounded-full transition-none"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        >
          <img 
            src="/images/roulette/룰렛판_1757563820947.png" 
            alt="룰렛 판"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* 당첨 눈금 (고정) - 12시 방향 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
        <img 
          src="/images/roulette/룰렛당첨눈금_1757563820946.png" 
          alt="당첨 눈금"
          className="w-8 h-12 object-contain drop-shadow-lg"
        />
      </div>

      {/* 스핀 중일 때 효과 */}
      {isSpinning && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400/70 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full border-2 border-rose-400/70 animate-ping"></div>
        </>
      )}
    </div>
  );
});

RouletteWheel.displayName = "RouletteWheel";

export default RouletteWheel;
