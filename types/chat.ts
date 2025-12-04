// src/types/chat.ts

export type ChatSender = "me" | "bot";

export type ChatRole = "user" | "assistant";

export interface ChatResponse {
  answer: string;
  persona: string | number;
}

export interface ChatHistoryItem {
  role: ChatRole;
  content: string;
}
