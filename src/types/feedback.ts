export interface IntroFeedbackResponse {
  userId?: number;
  feedback: string;
  original_resume: string;
  regen_resume: string;
  regen_toss_resume: string;
}
