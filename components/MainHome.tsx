"use client";

import { useState } from "react";
import Image from "next/image";
import { TodayHistory } from "@/types/todayHistory";
import { ContentItem } from "@/types/contents";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoClose, IoChevronUp, IoChevronDown } from "react-icons/io5";

interface MainHomeProps {
  todayHistory: TodayHistory | null;
  contents: ContentItem[];
}

export default function MainHome({ todayHistory, contents }: MainHomeProps) {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "sillok">("today");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const cleanSummary = (text?: string | null) => {
    if (!text) return "";
    return text
      .replace(/^\*\*\s*/, "")
      .replace(/\s*\*\*$/, "")
      .trim();
  };

  const todayDate = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  const historySummary =
    cleanSummary(todayHistory?.history?.summary) ||
    "오늘 이야기를 가져오지 못했소.";

  const sillokSummary =
    cleanSummary(todayHistory?.sillok?.summary) ||
    "조선의 기록을 가져오지 못했소.";

  return (
    <>
      {/* === 메인 영역 (오늘의 이슈) === */}
      <div className="w-full flex-1 flex flex-col px-4 py-4 md:py-8 relative gap-4 md:gap-6 justify-center">
        {/* 1. 말풍선 영역 */}
        <div className="w-full flex items-end justify-center">
          <div className="relative w-full max-w-md bg-white px-4 md:px-5 py-4 md:py-6 rounded-3xl shadow-md text-center border border-zinc-200 flex flex-col items-center justify-start max-h-[40vh] md:max-h-[55vh] overflow-visible animate-[fade-up-soft_0.5s_ease-out]">
            {/* 상단 날짜 zgb*/}
            <div className="w-full mb-2 md:mb-3 text-left">
              <p className="text-sm md:text-lg text-zinc-600 font-bold">
                📅 {todayDate} 오늘의 역사
              </p>
            </div>

            {/* 탭 버튼 */}
            <div className="w-full flex mb-3 md:mb-4 rounded-2xl bg-zinc-100 p-1 text-xs md:text-sm shrink-0">
              <button
                className={`flex-1 py-1.5 md:py-2 rounded-2xl transition-all ${
                  activeTab === "today"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
                onClick={() => setActiveTab("today")}
              >
                오늘의 이슈
              </button>
              <button
                className={`flex-1 py-1.5 md:py-2 rounded-2xl transition-all ${
                  activeTab === "sillok"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
                onClick={() => setActiveTab("sillok")}
              >
                조선의 이야기
              </button>
            </div>

            {/* 텍스트 내용 */}
            <div className="w-full h-full overflow-y-auto text-left text-[13px] md:text-[15px] leading-relaxed text-zinc-700 whitespace-pre-line custom-scrollbar pr-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeTab === "today" ? historySummary : sillokSummary}
              </ReactMarkdown>
            </div>

            {/* 말풍선 꼬리 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-zinc-200 rotate-45" />
          </div>
        </div>

        {/* 2. 캐릭터 이미지 */}
        <div className="w-full flex items-start justify-center">
          <div className="relative w-full flex justify-center max-h-[250px] md:max-h-[370px] animate-[float-soft_3s_ease-in-out_infinite]">
            <Image
              src="/character/장군이.gif"
              alt="장군이"
              width={300}
              height={300}
              className="w-[60%] md:w-[70%] h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* === Bottom Sheet (콘텐츠 추천) === */}
      {isSheetOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-300"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      {/* 시트 본체 */}
      <div
        className={`
          absolute left-0 right-0 bottom-0 bg-white rounded-t-xl shadow-[0_-30px_20px_rgba(0,0,0,0.1)]
          z-20 transition-transform duration-500 ease-in-out
          flex flex-col
          ${
            isSheetOpen
              ? "translate-y-0 h-[70vh] md:h-[80vh]"
              : "translate-y-[calc(100%-3.5rem)] h-[50vh] md:h-[70vh]"
          }
        `}
      >
        {/* 핸들바 (클릭하여 토글) */}
        <div
          className="w-full pt-4 pb-3 flex flex-col items-center justify-center cursor-pointer active:bg-zinc-50 rounded-t-[2rem] relative"
          onClick={() => setIsSheetOpen(!isSheetOpen)}
        >
          {!isSheetOpen && contents && contents.length > 0 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] text-amber-700 shadow-sm">
                👆 위로 올려보시오
              </div>
            </div>
          )}

          <div className="w-12 h-1.5 bg-zinc-200 rounded-full mb-3" />

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-zinc-600 font-semibold text-sm md:text-base">
              <span>오늘의 콘텐츠 추천!</span>
              {isSheetOpen ? <IoChevronDown /> : <IoChevronUp />}
            </div>
          </div>
        </div>

        {/* 콘텐츠 그리드 영역 */}
        <div className="flex-1 w-full px-5 overflow-y-auto pb-10 custom-scrollbar">
          {contents && contents.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-8">
              {contents.map((item: ContentItem, index: number) => (
                <div
                  key={item.id || index}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setSelectedStory(item.story)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow border border-zinc-200 aspect-[3/4] w-full">
                    <img
                      src={item.image || "/default.png"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="w-full mt-2 flex flex-col items-center text-center">
                    <h3 className="font-bold text-zinc-800 text-[14px] md:text-[15px] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] md:text-[11px] text-zinc-500 mt-1">
                      {item.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === Story 팝업 모달 (기존 유지) === */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white px-7 pt-12 pb-9 rounded-2xl max-w-md w-[85%] shadow-2xl border border-zinc-200 text-center relative animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-zinc-700 whitespace-pre-line text-md max-h-[60vh] overflow-y-auto scrollbar-hide text-left leading-7">
              {selectedStory}
            </p>
            <button
              className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-zinc-800 transition-colors"
              onClick={() => setSelectedStory(null)}
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
