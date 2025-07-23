const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');

const messages = [
  "당신의 기부는 누군가의 내일을 밝게 합니다.",
  "세상에 희망을 전하는 따뜻한 손길이에요.",
  "기부는 가장 아름다운 나눔입니다.",
  "작은 정성이 큰 변화를 만듭니다.",
  "이 따뜻함, 분명히 누군가에게 전해질 거예요.",
  "당신은 정말 멋진 일을 하고 있어요!"
];

let currentRotation = 0;

spinBtn.addEventListener('click', () => {
  // 회전 각도: 현재 각도 + (5~8바퀴 랜덤)
  const extraRotations = Math.floor(Math.random() * 3) + 5; // 5~7바퀴
  const randomOffset = Math.floor(Math.random() * 360); // 랜덤 위치
  const newRotation = currentRotation + extraRotations * 360 + randomOffset;
  currentRotation = newRotation;

  // 회전 적용
  wheel.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
  wheel.style.transform = `rotate(${newRotation}deg)`;

  // 랜덤 메시지 출력 (회전 후)
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  result.textContent = ""; // 이전 메시지 제거
  setTimeout(() => {
    result.textContent = randomMessage;
  }, 4000); // transition 시간과 일치
});