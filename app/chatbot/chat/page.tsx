// app/chatbot/chat/page.tsx
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { characters } from "@/constants/characters";
import { FaArrowLeft } from "react-icons/fa6";
import { ChatHistoryItem } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { requestChatMessage } from "./actions";

type ChatMessage = {
  from: "me" | "bot";
  text: string;
};

function ChatContent() {
  const router = useRouter();
  const params = useSearchParams();

  const indexParam = params.get("index");
  const nameParam = params.get("name");

  const personaIndex = indexParam ? parseInt(indexParam, 10) : 0;
  const persona = characters[personaIndex] ?? {
    name: "캐릭터",
    welcomeMessage: "캐릭터입니다.",
    promptLabel: "[질문]",
    answerLabel: "[답변]",
  };

  const characterName = nameParam || persona.name || "캐릭터";
  const promptLabel = (persona.promptLabel || "[질문]")
    .replace(/\n/g, "")
    .trim();
  const answerLabel = (persona.answerLabel || "[답변]")
    .replace(/\n/g, "")
    .trim();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text:
        persona.welcomeMessage ||
        `${characterName}입니다. 무엇을 알고 싶은가요?`,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 항상 맨 아래로
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 페이지 이탈(뒤로가기/새로고침 등) 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 상단 뒤로가기 버튼 클릭 시 confirm
  const handleBack = () => {
    const ok = window.confirm(
      "현재 대화 내용은 저장되지 않습니다.\n정말 뒤로 가겠습니까?"
    );
    if (ok) router.back();
  };

  // ChatMessage[] -> ChatHistoryItem[] 변환
  const buildHistory = (msgs: ChatMessage[]): ChatHistoryItem[] =>
    msgs.map((m) => ({
      role: m.from === "me" ? "user" : "assistant",
      content: m.text,
    }));

  // 메시지 전송 + API 연동
  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue.trim();
    const currentHistory = buildHistory(messages);

    // 내 메시지 먼저 추가
    const newMessage: ChatMessage = { from: "me", text: userText };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      const replyText = await requestChatMessage(
        personaIndex,
        userText,
        currentHistory
      );

      setMessages((prev) => [...prev, { from: "bot", text: replyText }]);
    } catch (error) {
      console.error("chat api error: ", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "죄송합니다. 서버와 통신 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative flex justify-center min-h-screen z-50">
      <div className="relative w-full max-w-lg h-screen flex flex-col bg-white">
        {/* 헤더 */}
        <div className="shrink-0 px-5 h-16 flex items-center gap-2 border-b border-gray-100">
          <button
            onClick={handleBack}
            className="text-sm text-gray-500 hover:text-black hover:underline underline-offset-4"
          >
            <FaArrowLeft />
          </button>
          <div className="flex-1 text-center text-lg font-bold">
            {characterName}와의 대화
          </div>
          <div className="w-6" />
        </div>

        {/* 메시지 스크롤 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[70%] px-3 py-2 rounded-xl text-base sm:text-lg mt-2 ml-1
                  ${
                    msg.from === "me"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }
                `}
              >
                {/* 레이블 (promptLabel / answerLabel) */}
                <div className="text-[11px] opacity-70 mb-1">
                  {msg.from === "me" ? promptLabel : answerLabel}
                </div>

                {/* 실제 메시지 */}
                <div className="prose prose-sm max-w-full break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* 답변 생성 중 로딩 말풍선 */}
          {isSending && (
            <div className="flex mb-3 justify-start animate-fade-in">
              <div className="bg-gray-200 text-black rounded-bl-none max-w-[70%] px-4 py-3 rounded-xl mt-2 ml-1">
                <div className="text-[11px] opacity-70 mb-2">{answerLabel}</div>
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 입력창 - 하단 고정 */}
        <div className="shrink-0 px-4 h-20 flex gap-4 items-center border-t border-gray-200 bg-white">
          <input
            type="text"
            className="flex-1 border-b border-gray-600 rounded-xl px-3 py-2 text-base sm:text-lg font-semibold focus:outline-none"
            placeholder="메시지를 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isSending}
            className={`
              px-4 py-2 rounded-xl text-sm sm:text-base font-semibold
              ${
                isSending
                  ? "bg-neutral-300 text-gray-500 cursor-not-allowed"
                  : "bg-neutral-700 text-white hover:bg-neutral-800"
              }
            `}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ChatContent />
    </Suspense>
  );
}
