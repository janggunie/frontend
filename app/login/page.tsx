"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      router.push("/");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-6 sm:px-3 sm:py-4 md:px-4 md:py-8">
      <div className="w-full max-w-md relative">
        <div className="relative z-10 px-8">
          <h1 className="font-semibold text-center text-2xl">환영하오</h1>
          <p className="text-xs sm:text-[11px] md:text-sm text-zinc-500 mb-6 text-center">
            장구니 학습 노트에 오신 걸 환영합니다.
          </p>

          {/* form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-[10px] md:text-xs text-zinc-600 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue="janggunie"
                className="
                  w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs md:text-sm text-zinc-800 shadow-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition sm:py-1.5
                "
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-[10px] md:text-xs text-zinc-600 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                defaultValue="janggunie"
                className="
                  w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs md:text-sm text-zinc-800 shadow-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition sm:py-1.5
                "
                placeholder="비밀번호"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-[11px] text-red-500 font-medium">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 mt-3 text-xs md:text-sm font-semibold text-zinc-800 bg-amber-100 hover:bg-yellow-200 shadow active:scale-[0.98] transition sm:py-1.5"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-px bg-zinc-300 flex-1" />
            <span className="text-[10px] text-zinc-400">또는</span>
            <div className="h-px bg-zinc-300 flex-1" />
          </div>

          {/* Social Login */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-[11px] md:text-xs text-zinc-700 hover:bg-zinc-100 shadow-sm cursor-not-allowed"
            >
              🟦 Google 계정으로 로그인
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-[11px] md:text-xs text-zinc-700 hover:bg-zinc-100 shadow-sm cursor-not-allowed"
            >
              🟡 Kakao 계정으로 로그인
            </button>
          </div>

          <div className="mt-4 text-[10px] md:text-[11px] text-zinc-500 text-center">
            아직 계정이 없나요?{" "}
            <Link
              href="#"
              className="text-zinc-700 font-medium underline underline-offset-2 cursor-not-allowed"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
