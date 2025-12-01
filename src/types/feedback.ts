/**
 * 자기소개서 AI 피드백 응답 타입
 * 백엔드 IntroFeedbackResponse와 매핑
 */
export type IntroFeedbackResponse = {
  userId: number;
  originalResume: string; // original_resume 매핑
  feedback: string;
  regenResume: string;    // regen_resume 매핑
};

