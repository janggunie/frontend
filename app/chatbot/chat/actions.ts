// app/chatbot/chat/actions.ts
"use server";

import { api } from "@/lib/axios";
import { ChatHistoryItem, ChatResponse } from "@/types/chat";

/**
 * 챗봇 메시지 요청
 */
export async function requestChatMessage(
  personaIndex: number,
  userText: string,
  history: ChatHistoryItem[]
): Promise<string> {
  const res = await api.post<ChatResponse>("/api/v1/chat", {
    persona_index: personaIndex,
    user_input: userText,
    history,
  });

  return res.data.answer;
}
