"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QuizQuestion } from "@/types/quiz";
import { BiArrowBack, BiChevronRight } from "react-icons/bi";
import { IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";

export default function SolveQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [level, setLevel] = useState("");
  const [keyword, setKeyword] = useState("");
  const [index, setIndex] = useState(0);

  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  // 포커스 관리를 위한 Ref
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 세션스토리지 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedQuizData = sessionStorage.getItem("quizData");
    const storedLevel = sessionStorage.getItem("quizLevel");
    const storedKeyword = sessionStorage.getItem("quizKeyword");

    if (!storedQuizData || !storedLevel || !storedKeyword) {
      alert("퀴즈 데이터가 없습니다. 다시 시작해주세요.");
      router.push("/quiz");
      return;
    }

    try {
      const parsedData = JSON.parse(storedQuizData);
      setQuestions(parsedData);
      setLevel(storedLevel);
      setKeyword(storedKeyword);
    } catch (error) {
      console.error("Failed to parse quiz data:", error);
      alert("퀴즈 데이터를 불러오는데 실패했습니다.");
      router.push("/quiz");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const current = questions[index];

  // 다음 문제로 이동
  const handleNext = () => {
    setShowResult(false);
    setUserAnswer("");
    setIndex((i) => i + 1);
  };

  // 뒤로 가기(나가기)
  const handleExit = () => {
    if (window.confirm("퀴즈를 끝내겠습니까?\n저장되지 않습니다.")) {
      router.push("/quiz");
    }
  };

  useEffect(() => {
    if (!showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [index, showResult]);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.focus();
    }
  }, [showResult]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      alert("정답을 입력해주세요!");
      return;
    }
    setShowResult(true);
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg mx-auto h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-medium">시험지 받는 중...</p>
      </div>
    );
  }

  // 완료 화면
  if (!current) {
    return (
      <div className="w-full max-w-lg mx-auto h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-zinc-50 px-6 animate-fadeIn">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-4xl border border-zinc-100">
          🎓
        </div>
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">시험 종료!</h2>
        <p className="text-zinc-500 mb-10 text-center leading-relaxed">
          모든 문제를 풀었습니다.
          <br />
          수고하셨습니다.
        </p>

        <button
          onClick={() => router.push("/quiz")}
          className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto h-[calc(100vh-3.5rem)] bg-zinc-50 flex flex-col relative">
      {/* 1. 상단 네비게이션 & 진행바 */}
      <div className="px-4 pt-4 pb-2 bg-zinc-50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleExit}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-200 transition-colors text-zinc-600"
          >
            <BiArrowBack size={24} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-zinc-400">{level}</span>
            <span className="text-sm font-bold text-zinc-800">{keyword}</span>
          </div>
        </div>

        {/* 진행바 */}
        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-800 transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. 문제 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-bold rounded-lg">
            Q{current.number}
          </span>
          <span className="text-zinc-400 text-xs font-medium">
            {index + 1} / {questions.length}
          </span>
        </div>

        {/* 질문 카드 */}
        <div className="w-full bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-zinc-100 mb-8 min-h-[140px] flex items-center justify-center animate-[fade-up-soft_0.3s_ease-out]">
          <p className="text-xl font-bold leading-snug text-center text-zinc-800 keep-all">
            {current.question}
          </p>
        </div>

        {/* 결과 보기 모드 */}
        {showResult && (
          <div
            ref={resultRef}
            className="animate-[fade-up-soft_0.4s_ease-out] focus:outline-none pb-8"
            tabIndex={-1}
          >
            {/* 내 답안 */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm mb-3">
              <div className="text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> 내가
                적은 답
              </div>
              <p className="text-lg font-bold text-zinc-800 break-keep">
                {userAnswer}
              </p>
            </div>

            {/* 정답 */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 shadow-sm mb-6">
              <div className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                <IoCheckmarkCircle /> 실제 정답
              </div>
              <p className="text-xl font-black text-blue-600 break-keep">
                {current.answer}
              </p>
            </div>

            {/* 해설 */}
            {current.explanation && (
              <div className="bg-zinc-100/50 p-5 rounded-2xl text-zinc-600 text-[15px] leading-relaxed">
                <span className="font-bold text-zinc-800 block mb-2 text-sm">
                  💡 해설
                </span>
                {current.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. 하단 입력/버튼 영역 (키보드 대응을 위해 고정하지 않고 flex flow 따름) */}
      {!showResult ? (
        <div className="p-4 bg-white border-t border-zinc-100 shrink-0 animate-[slide-up_0.3s_ease-out]">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-4 text-lg text-center bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all placeholder-zinc-300 mb-3"
            placeholder="정답을 입력하세요"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-black transition-all active:scale-[0.98]"
          >
            정답 확인하기
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white border-t border-zinc-100 shrink-0 animate-[slide-up_0.3s_ease-out]">
          <button
            onClick={handleNext}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-1"
          >
            다음 문제 <BiChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
