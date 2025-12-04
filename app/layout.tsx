import type { Metadata } from "next";
import { Gowun_Batang, Song_Myung, Jua } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// 1. 고운바탕 (부드러운 명조)
const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun",
});

// 2. 송명 (강한 명조)
const songMyung = Song_Myung({
  weight: ["400"],
  // subsets: ["latin"],
  variable: "--font-song",
});

// 3. 주아 (둥근 붓글씨)
const jua = Jua({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jua",
});

export const metadata: Metadata = {
  title: "대화하는 역사 친구 장구니",
  description:
    "AI와 함께하는 즐거운 역사 학습! 장구니와 대화하며 퀴즈와 시뮬레이션으로 역사를 생생하게 체험해보세요.",
  icons: {
    icon: "/favicon/favicon.svg",
  },
  // 카카오톡/링크 공유 시 보여질 정보
  openGraph: {
    title: "대화하는 역사 친구 장구니",
    description: "채팅, 퀴즈, 시뮬레이션으로 만나는 AI 역사 플랫폼",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${gowunBatang.variable} ${songMyung.variable} ${jua.variable} antialiased bg-background overflow-y-auto h-screen`}
      >
        <div className="flex w-full h-screen justify-center">
          <main className="relative flex flex-col w-full max-w-lg mx-auto bg-background items-stretch shadow-2xl  md:overflow-hidden">
            <Header />
            <div className="pt-14 px-0 h-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
