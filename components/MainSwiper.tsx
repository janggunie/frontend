"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import { TodayHistory } from "@/types/todayHistory";
import { ContentItem } from "@/types/contents";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoClose } from "react-icons/io5";
import { Swiper as SwiperType } from "swiper";

interface MainSwiperProps {
  todayHistory: TodayHistory | null;
  contents: ContentItem[];
}

export default function MainSwiper({
  todayHistory,
  contents,
}: MainSwiperProps) {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "sillok">("today");
  const swiperRef = useRef<SwiperType | null>(null);

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
      <div className="relative w-full h-full group">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
          }}
          modules={[Mousewheel, Pagination, Navigation]}
          className="w-full h-full"
        >
          {/* Slide 1 — 오늘의 이슈 */}
          <SwiperSlide>
            <div className="w-full h-full flex flex-col px-4 relative gap-10">
              {/* 말풍선 영역 */}
              <div className="flex-[0.6] w-full flex items-end justify-center">
                <div className="relative w-full max-w-md bg-white px-5 py-6 rounded-3xl shadow-lg text-center border border-zinc-200 flex flex-col items-center justify-start max-h-[60vh] overflow-visible animate-[fade-up-soft_0.5s_ease-out]">
                  {/* 상단 날짜 + 제목 */}
                  <div className="w-full mb-3 text-left">
                    <p className="text-md text-zinc-400 font-medium">
                      📅 {todayDate} 오늘의 역사
                    </p>
                  </div>

                  {/* 탭 버튼 */}
                  <div className="w-full flex mb-4 rounded-2xl bg-zinc-100 p-1 text-sm">
                    <button
                      className={`flex-1 py-2 rounded-2xl transition-all ${
                        activeTab === "today"
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-zinc-500"
                      }`}
                      onClick={() => setActiveTab("today")}
                    >
                      오늘의 이슈
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-2xl transition-all ${
                        activeTab === "sillok"
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-zinc-500"
                      }`}
                      onClick={() => setActiveTab("sillok")}
                    >
                      조선의 이야기
                    </button>
                  </div>

                  {/* 내용 영역 */}
                  <div className="w-full h-full overflow-y-auto text-left text-[15px] leading-relaxed text-zinc-700 whitespace-pre-line custom-scrollbar pr-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeTab === "today" ? historySummary : sillokSummary}
                    </ReactMarkdown>
                  </div>

                  {/* 말풍선 꼬리 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-zinc-200 rotate-45 shadow-sm" />
                </div>
              </div>

              {/* 캐릭터 이미지 */}
              <div className="flex-[0.4] w-full flex items-start justify-center">
                <div className="relative max-w-[280px] w-full flex justify-center animate-[float-soft_3s_ease-in-out_infinite]">
                  <Image
                    src="/character/장군이.gif"
                    alt="장군이"
                    width={300}
                    height={300}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 — 콘텐츠 추천 */}
          <SwiperSlide>
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-full max-w-lg max-h-[calc(100vh-8rem)] px-5 overflow-y-auto scrollbar-hide">
                <p className="col-span-2 text-zinc-400 text-lg font-semibold w-full mb-6">
                  역사랑 친해지기
                </p>

                {(!contents || contents.length === 0) && (
                  <p className="text-center text-zinc-500 mt-10">
                    콘텐츠를 불러오는 중…
                  </p>
                )}

                {contents && contents.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {contents.map((item: ContentItem, index: number) => (
                      <div
                        key={item.id || index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setSelectedStory(item.story)}
                      >
                        <img
                          src={item.image || "/default.png"}
                          alt={item.title}
                          className="w-full rounded-xl shadow border border-zinc-200 object-cover aspect-[3/4]"
                        />
                        <div className="w-full mt-2 flex flex-col items-center justify-center text-neutral-700">
                          <h3 className="font-bold text-zinc-800 text-sm sm:text-base">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-zinc-500 mt-1 w-[80%] text-center">
                            {item.character}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1.5">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Story 팝업 */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white px-7 pt-12 pb-9 rounded-2xl max-w-md w-3/4 shadow-lg border border-zinc-200 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-zinc-700 whitespace-pre-line text-md max-h-60 overflow-y-auto scrollbar-hide text-left">
              {selectedStory}
            </p>
            <button
              className="absolute top-3 right-3  text-zinc-500 hover:text-zinc-800"
              onClick={() => setSelectedStory(null)}
            >
              <IoClose size={30} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
