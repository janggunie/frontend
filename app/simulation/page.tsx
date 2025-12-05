// app/simulation/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { fetchThemes, startStory, nextStory } from "./actions";
import { Theme, StoryScene } from "@/types/simulation";
import { BiArrowBack, BiHistory, BiBookContent } from "react-icons/bi";
import { IoSparkles } from "react-icons/io5";

// 배경 이미지 배열 (요청하신 경로)
const bgImages = [
  "/image/scene1.png",
  "/image/scene2.jpg",
  "/image/scene3.jpg",
  "/image/scene4.webp",
  "/image/scene5.jpg",
];

export default function SimulationPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [storyScene, setStoryScene] = useState<StoryScene | null>(null);
  const [summaries, setSummaries] = useState<string>("");
  const [turn, setTurn] = useState(1);

  // 로딩 상태 관리
  const [loadingTheme, setLoadingTheme] = useState<string | null>(null);
  const [loadingChoice, setLoadingChoice] = useState<string | null>(null);

  // 스크롤 제어용
  const contentRef = useRef<HTMLDivElement>(null);

  // API 연동
  useEffect(() => {
    async function loadThemes() {
      const data = await fetchThemes();
      if (data) setThemes(data);
    }
    loadThemes();
  }, []);

  // 선택지 변경 시 스크롤 최하단 이동
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [storyScene]);

  // 브라우저 새로고침/닫기 방지
  useEffect(() => {
    if (!selectedTheme) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedTheme]);

  // 스토리 시작
  const handleStart = async (themeKey: string) => {
    setLoadingTheme(themeKey);
    try {
      const result = await startStory(themeKey);
      if (result.error) {
        alert(result.error);
        return;
      }

      if (!result.story || result.story.length === 0) {
        alert("스토리를 불러오지 못했습니다.");
        return;
      }

      const firstScene = result.story[0];
      setSelectedTheme(themeKey);
      setStoryScene(firstScene);
      setSummaries(firstScene.scene);
      setTurn(1);
    } finally {
      setLoadingTheme(null);
    }
  };

  // 선택지 클릭
  const handleChoice = async (choice: string) => {
    if (!selectedTheme) return;
    setLoadingChoice(choice);
    try {
      const res = await nextStory({
        theme: selectedTheme,
        previousSummaries: summaries,
        userChoice: choice,
        turn: turn + 1,
      });

      if (res.error) {
        alert(res.error);
        return;
      }

      if (!res.scene) {
        alert("다음 장면을 불러오지 못했습니다.");
        return;
      }

      setStoryScene({
        scene: res.scene,
        choices: res.choices || null,
        is_final: res.is_final,
      });
      setSummaries((prev) => prev + "\n" + res.scene);
      setTurn((prev) => prev + 1);
    } finally {
      setLoadingChoice(null);
    }
  };

  // 텍스트 정제
  const getSceneTextOnly = (scene: string) => {
    return scene
      .split("\n")
      .filter((line) => !/^[A-Z]:/.test(line))
      .map((line) => line.replace(/\[선택지\]|\[장면\]|\[결말\]/g, ""))
      .join("\n")
      .trim();
  };

  // 뒤로 가기
  const handleBack = () => {
    if (
      window.confirm(
        "현재 진행 중인 스토리가 초기화됩니다.\n정말 나가시겠습니까?"
      )
    ) {
      setSelectedTheme(null);
      setStoryScene(null);
      setSummaries("");
      setTurn(1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full bg-zinc-50 relative flex flex-col overflow-hidden font-sans">
      {/* --------------------------- 테마 선택 화면 --------------------------- */}
      {!selectedTheme && (
        <div className="flex-1 flex flex-col h-full overflow-hidden px-5 py-6">
          <div className="mb-6 animate-[fade-up-soft_0.5s_ease-out]">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm mb-3 border border-zinc-100">
              <IoSparkles className="text-xl text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-1">연희놀이</h1>
            <p className="text-sm text-zinc-500">
              역사 속 주인공이 되어 선택을 내려보세요.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-4 animate-[fade-up-soft_0.6s_ease-out]">
            {themes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
                <span className="text-sm text-zinc-400">
                  테마를 불러오는 중...
                </span>
              </div>
            ) : (
              themes.map((theme, index) => {
                const bgImage = bgImages[index % bgImages.length];

                return (
                  <button
                    key={theme.theme_key}
                    onClick={() => handleStart(theme.theme_key)}
                    disabled={loadingTheme === theme.theme_key}
                    className="group relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-sm active:scale-[0.98] transition-all duration-300 shrink-0"
                  >
                    {/* 배경 이미지 */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full md:p-6 p-4 z-10 flex flex-col justify-end text-left h-full">
                      <div className="transform translate-y-0 transition-transform duration-500">
                        {loadingTheme === theme.theme_key && (
                          <div className="mb-2 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}

                        <span className="block text-xl font-bold text-white md:mb-1 mb-2 drop-shadow-md">
                          {theme.title}
                        </span>

                        <span className="block text-sm text-gray-200 font-medium line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          {theme.background}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* --------------------------- 스토리 진행 화면 --------------------------- */}
      {selectedTheme && storyScene && (
        <div className="flex-1 flex flex-col h-full relative">
          {/* 상단 헤더 */}
          <div className="px-4 py-3 bg-zinc-50 flex items-center justify-between shrink-0 z-10">
            {!storyScene.is_final ? (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-zinc-200 transition-colors text-zinc-600"
              >
                <BiArrowBack size={24} />
              </button>
            ) : (
              <div className="w-8" />
            )}

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-zinc-400 mb-0.5">
                {storyScene.is_final ? "ENDING" : `TURN ${turn} / 5`}
              </span>
              <span className="text-sm font-bold text-zinc-800 line-clamp-1 max-w-[200px]">
                {themes.find((t) => t.theme_key === selectedTheme)?.title}
              </span>
            </div>

            <div className="w-8" />
          </div>

          {/* 진행바 (헤더 하단) */}
          {!storyScene.is_final && (
            <div className="w-full h-1 bg-zinc-200 shrink-0">
              <div
                className="h-full bg-zinc-800 transition-all duration-500 ease-out"
                style={{ width: `${(turn / 5) * 100}%` }}
              />
            </div>
          )}

          {/* 메인 컨텐츠 영역 (스크롤) */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar flex flex-col gap-6"
          >
            {/* 엔딩 화면 */}
            {storyScene.is_final ? (
              <div className="flex flex-col gap-5 animate-[fade-up-soft_0.5s_ease-out]">
                {/* 스토리 결말 */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-50">
                    <BiBookContent className="text-zinc-400 text-xl" />
                    <h3 className="text-base font-bold text-zinc-800">
                      나의 이야기 결말
                    </h3>
                  </div>
                  <div className="text-[15px] leading-7 text-zinc-700 whitespace-pre-line">
                    {getSceneTextOnly(storyScene.scene)}
                  </div>
                </div>

                {/* 역사적 사실 */}
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm mb-20">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-100/50">
                    <BiHistory className="text-amber-600 text-xl" />
                    <h3 className="text-base font-bold text-amber-900">
                      실제 역사
                    </h3>
                  </div>
                  <div className="text-[15px] leading-7 text-amber-900/80 whitespace-pre-line">
                    {themes.find((t) => t.theme_key === selectedTheme)
                      ?.history_description ||
                      "역사 정보를 불러올 수 없습니다."}
                  </div>
                </div>
              </div>
            ) : (
              /* 진행 중 화면 */
              <div className="animate-[fade-up-soft_0.5s_ease-out]">
                {/* 씬 텍스트 */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-zinc-100 mb-6">
                  <p className="text-[16px] leading-relaxed text-zinc-800 whitespace-pre-line">
                    {getSceneTextOnly(storyScene.scene)}
                  </p>
                </div>

                {/* 선택지 영역 안내 문구 */}
                {storyScene.choices && (
                  <p className="text-center text-xs text-zinc-400 font-bold mb-4 animate-pulse">
                    운명을 선택하세요
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 하단 고정 영역 (선택지 / 버튼) */}
          <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-zinc-100 shrink-0">
            {storyScene.is_final ? (
              <button
                onClick={handleBack}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-lg font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg"
              >
                다른 역사 체험하기
              </button>
            ) : (
              storyScene.choices && (
                <div className="flex flex-col gap-3 animate-[slide-up_0.4s_ease-out]">
                  {Object.entries(storyScene.choices).map(([key, text]) => (
                    <button
                      key={key}
                      onClick={() => handleChoice(text)}
                      disabled={loadingChoice !== null}
                      className={`
                        relative w-full text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98]
                        ${
                          loadingChoice === text
                            ? "bg-zinc-100 border-zinc-200"
                            : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-md"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                           flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                           ${
                             loadingChoice === text
                               ? "bg-zinc-300 text-white"
                               : "bg-zinc-100 text-zinc-600"
                           }
                         `}
                        >
                          {key}
                        </span>
                        <span
                          className={`text-[15px] font-medium flex-1 ${
                            loadingChoice === text
                              ? "text-zinc-400"
                              : "text-zinc-800"
                          }`}
                        >
                          {text}
                        </span>

                        {loadingChoice === text && (
                          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
