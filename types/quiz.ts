// types/quiz.ts

export interface QuizQuestion {
  number: number;
  question: string;
  answer: string;
  explanation: string;
}

export interface CreateQuizRequest {
  difficulty: string;
  keyword: string;
  n_questions: number;
}
