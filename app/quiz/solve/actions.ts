"use server";

import { api } from "@/lib/axios";
import { QuizQuestion } from "@/types/quiz";

export async function createQuiz(
  difficulty: string,
  keyword: string,
  nQuestions: number = 10
): Promise<QuizQuestion[]> {
  try {
    const response = await api.post<QuizQuestion[]>("/api/v1/create_quiz", {
      difficulty,
      keyword,
      n_questions: nQuestions,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create quiz:", error);
    throw error;
  }
}
