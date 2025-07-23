// Gemini API 호출 함수
async function callGeminiAPI(prompt) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  const payload = { contents: chatHistory };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.warn("Gemini API 응답 구조가 예상과 다릅니다:", result);
      return "죄송합니다. 요약 내용을 가져올 수 없습니다.";
    }
  } catch (error) {
    console.error("Gemini API 호출 중 오류 발생:", error);
    return `오류 발생: ${error.message}. 잠시 후 다시 시도해주세요.`;
  }
}

// ✨ 사연 요약 기능
document.addEventListener("DOMContentLoaded", () => {
  const summarizeButtons = document.querySelectorAll(".summarize-button");
  const summaryModal = document.getElementById("summaryModal");
  const closeModalButton = document.getElementById("closeModalButton");
  const summaryText = document.getElementById("summaryText");
  const summarySpinner = document.getElementById("summarySpinner");

  summarizeButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const campaignCard = event.target.closest(".campaign-card");
      const descriptionElement = campaignCard.querySelector(
        ".campaign-description"
      );
      const campaignDescription = descriptionElement
        ? descriptionElement.textContent
        : "";

      summaryText.textContent = ""; // 이전 내용 초기화
      summarySpinner.classList.add("active"); // 스피너 활성화
      summaryModal.classList.add("active"); // 모달 열기

      const prompt = `다음 기부 사연을 50단어 이내로 요약해 주세요: ${campaignDescription}`;

      try {
        const summary = await callGeminiAPI(prompt);
        summaryText.textContent = summary;
      } catch (error) {
        summaryText.textContent = `요약 중 오류가 발생했습니다: ${error.message}`;
      } finally {
        summarySpinner.classList.remove("active"); // 스피너 비활성화
      }
    });
  });

  closeModalButton.addEventListener("click", () => {
    summaryModal.classList.remove("active"); // 모달 닫기
  });

  summaryModal.addEventListener("click", (event) => {
    if (event.target === summaryModal) {
      summaryModal.classList.remove("active"); // 오버레이 클릭 시 닫기
    }
  });

  // ✨ 기부 메시지 아이디어 생성 기능
  const generateMessageButton = document.getElementById(
    "generateMessageButton"
  );
  const donationMessageInput = document.getElementById("donationMessageInput");
  const donationMessageOutput = document.getElementById(
    "donationMessageOutput"
  );
  const messageSpinner = document.getElementById("messageSpinner");

  generateMessageButton.addEventListener("click", async () => {
    const userInput = donationMessageInput.value.trim();

    if (userInput === "") {
      donationMessageOutput.textContent =
        "기부 메시지 아이디어를 얻으려면 마음을 입력해주세요.";
      return;
    }

    donationMessageOutput.textContent = ""; // 이전 내용 초기화
    messageSpinner.classList.add("active"); // 스피너 활성화

    const prompt = `다음 기부자님의 마음을 담아 감동적인 기부 메시지 문구를 50단어 이내로 생성해 주세요. 존댓말을 사용하고, 친근하고 따뜻한 어조로 작성해 주세요. 기부자님의 마음: ${userInput}`;

    try {
      const generatedMessage = await callGeminiAPI(prompt);
      donationMessageOutput.textContent = generatedMessage;
    } catch (error) {
      donationMessageOutput.textContent = `메시지 생성 중 오류가 발생했습니다: ${error.message}`;
    } finally {
      messageSpinner.classList.remove("active"); // 스피너 비활성화
    }
  });
});
