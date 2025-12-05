// app/chatbot/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { characters } from "@/constants/characters";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function ChatbotSelectPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 스크롤 이벤트를 통해 현재 활성화된 인덱스 계산
  const handleScroll = () => {
    if (scrollRef.current) {
      const currentScrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const newIndex = Math.round(currentScrollLeft / width);
      setActiveIndex(newIndex);
    }
  };

  // 1. 드래그 시작
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // 2. 드래그 중단 (마우스가 영역을 벗어나거나 버튼을 뗐을 때)
  const onMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  // 3. 드래그 중 이동
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // * 1.5는 스크롤 속도 조절 (취향껏 조절)
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full relative overflow-hidden bg-zinc-50 flex">
      {/* 캐러셀 영역 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeaveOrUp}
        onMouseUp={onMouseLeaveOrUp}
        onMouseMove={onMouseMove}
        className={`w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x 
          ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab"} 
        `}
      >
        {characters.map((person, index) => (
          <div
            key={person.idx}
            className="min-w-full w-full h-full flex flex-col items-center justify-center snap-center relative pb-12"
          >
            {/* 1. 배경 텍스트 효과 */}
            <div className="absolute top-[14%] flex flex-col items-center select-none pointer-events-none z-0">
              <h2 className="text-6xl sm:text-7xl font-extrabold text-zinc-200 relative">
                {/* 잔상 효과 */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 left-0 text-zinc-300 opacity-20"
                    style={{
                      transform: `translate(${i * 1}px, ${i * 1}px)`,
                      filter: "blur(0.5px)",
                    }}
                  >
                    {person.name}
                  </span>
                ))}
                {/* 메인 텍스트 */}
                <span className="relative z-10">{person.name}</span>
              </h2>
            </div>

            {/* 2. 캐릭터 이미지 */}
            <div className="relative z-10 w-full flex justify-center items-center mt-4 mb-2 md:my-8 animate-[float-soft_3s_ease-in-out_infinite]">
              <img
                src={person.img}
                alt={person.name}
                className="h-[40%] max-h-[250px] h-auto object-contain drop-shadow-xl"
              />
            </div>

            {/* 3. 말풍선 및 액션 버튼 */}
            <div className="w-full px-6 flex flex-col items-center z-20 gap-5">
              {/* 말풍선 */}
              <div className="relative bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-zinc-200 max-w-xs animate-[fade-up-soft_0.5s_ease-out]">
                <p className="text-[15px] text-zinc-700 whitespace-pre-line text-center leading-relaxed font-medium">
                  {person.welcomeMessage}
                </p>
                {/* 말풍선 꼬리 */}
                <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-zinc-200 rotate-45" />
              </div>

              {/* 대화하기 버튼 */}
              <button
                className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white rounded-full text-sm font-semibold shadow-lg active:scale-95 transition-transform duration-200 hover:bg-zinc-800"
                onClick={() =>
                  router.push(
                    `/chatbot/chat?index=${
                      person.idx
                    }&name=${encodeURIComponent(person.name)}`
                  )
                }
              >
                <IoChatbubbleEllipsesOutline size={20} />
                <span>대화 시작하기</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. 하단 인디케이터 (Dots) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
        {characters.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === index ? "bg-zinc-800 w-6" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
