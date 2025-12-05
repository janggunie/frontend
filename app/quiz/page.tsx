"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "./actions";
import { BiSearchAlt2, BiCheckCircle, BiBookBookmark } from "react-icons/bi";

export default function QuizHome() {
  const [level, setLevel] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 난이도 매핑 (한글 -> 영문)
  const difficultyMap: Record<string, string> = {
    초시: "easy",
    복시: "medium",
    전시: "hard",
  };

  // 난이도별 부가 설명 및 색상 데이터
  const levelInfo: Record<
    string,
    { desc: string; color: string; activeColor: string; icon: string }
  > = {
    초시: {
      desc: "입문자를 위한 쉬운 난이도",
      color: "bg-green-50 text-green-700 border-green-200",
      activeColor: "bg-green-100 border-green-500 ring-1 ring-green-500",
      icon: "🌱",
    },
    복시: {
      desc: "도전을 즐기는 중간 난이도",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      activeColor: "bg-blue-100 border-blue-500 ring-1 ring-blue-500",
      icon: "🌿",
    },
    전시: {
      desc: "한계를 시험하는 높은 난이도",
      color: "bg-red-50 text-red-700 border-red-200",
      activeColor: "bg-red-100 border-red-500 ring-1 ring-red-500",
      icon: "🔥",
    },
  };

  const handleStart = async () => {
    if (!level || !keyword) {
      alert("난이도와 키워드를 모두 입력해주세요!");
      return;
    }

    setIsLoading(true);

    try {
      const difficulty = difficultyMap[level];
      const quizData = await createQuiz(difficulty, keyword, 10);

      // 퀴즈 데이터를 세션 스토리지에 저장
      sessionStorage.setItem("quizData", JSON.stringify(quizData));
      sessionStorage.setItem("quizLevel", level);
      sessionStorage.setItem("quizKeyword", keyword);

      // 퀴즈 풀이 페이지로 이동
      router.push("/quiz/solve");
    } catch (error) {
      console.error("퀴즈 생성 실패:", error);
      alert("퀴즈 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full bg-zinc-50 relative flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-8 custom-scrollbar">
        {/* 1. 헤더 영역 */}
        <div className="mb-8 text-center animate-[fade-up-soft_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm mb-4 border border-zinc-100">
            <BiBookBookmark className="text-2xl text-zinc-700" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">
            오늘의 과거 시험
          </h1>
          <p className="text-sm text-zinc-500">
            도전할 난이도와 주제를 선택하여
            <br />
            역사 지식을 테스트해보세요.
          </p>
        </div>

        {/* 2. 난이도 선택 */}
        <div className="flex flex-col gap-3 mb-8 animate-[fade-up-soft_0.6s_ease-out]">
          <label className="text-xs font-bold text-zinc-400 ml-1">
            난이도 선택
          </label>
          {["초시", "복시", "전시"].map((item) => {
            const isSelected = level === item;
            const info = levelInfo[item];

            return (
              <button
                key={item}
                onClick={() => setLevel(item)}
                disabled={isLoading}
                className={`
                  relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 w-full text-left
                  ${
                    isSelected
                      ? `${info.activeColor} shadow-sm scale-[1.01]`
                      : `${info.color} hover:bg-opacity-80`
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <span
                      className="text-lg font-bold block leading-none mb-1"
                      style={{ fontFamily: "var(--font-gungseo)" }}
                    >
                      {item}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      {info.desc}
                    </span>
                  </div>
                </div>

                {/* 선택 표시 체크 아이콘 */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${
                      isSelected
                        ? "border-current bg-current"
                        : "border-black/10 bg-transparent"
                    }
                  `}
                >
                  {isSelected && (
                    <BiCheckCircle className="text-white w-full h-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. 키워드 입력 */}
        <div className="flex flex-col gap-2 animate-[fade-up-soft_0.7s_ease-out]">
          <label className="text-xs font-bold text-zinc-400 ml-1">
            주제 키워드
          </label>
          <div
            className={`
              flex items-center px-4 py-3.5 rounded-2xl border bg-white transition-all duration-200
              ${
                keyword
                  ? "border-zinc-800 ring-1 ring-zinc-800 shadow-sm"
                  : "border-zinc-200 focus-within:border-zinc-400"
              }
            `}
          >
            <BiSearchAlt2 className="text-zinc-400 text-xl mr-3" />
            <input
              type="text"
              placeholder="예: 세종대왕, 임오군란..."
              className="w-full bg-transparent text-base text-zinc-800 placeholder-zinc-300 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 4. 하단 고정 버튼 */}
      <div className="p-4 bg-zinc-50 shrink-0">
        <button
          onClick={handleStart}
          disabled={isLoading || !level || !keyword}
          className={`
            w-full py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all duration-200
            flex justify-center items-center gap-2
            ${
              isLoading || !level || !keyword
                ? "bg-zinc-300 cursor-not-allowed shadow-none"
                : "bg-zinc-900 active:scale-[0.98] hover:bg-black"
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-base">시험 문제 출제 중...</span>
            </>
          ) : (
            "과거 시험 보러가기"
          )}
        </button>
      </div>
    </div>
  );
}
