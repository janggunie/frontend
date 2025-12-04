// app/page.tsx
import MainHome from "@/components/MainHome";
import { ContentItem } from "@/types/contents";
import { TodayHistory } from "@/types/todayHistory";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 서버에서 사용할 셔플 함수
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function getHomeData() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const [todayRes, contentsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/v1/today-history`, {
        cache: "no-store",
        headers: { Cookie: cookieHeader },
      }),
      fetch(`${BASE_URL}/api/v1/contents`, {
        cache: "no-store",
        headers: { Cookie: cookieHeader },
      }),
    ]);

    if (!todayRes.ok || !contentsRes.ok) {
      console.error("API Error Status:", todayRes.status, contentsRes.status);
    }

    const todayHistory = (await todayRes
      .json()
      .catch(() => null)) as TodayHistory | null;

    const contents = (await contentsRes
      .json()
      .catch(() => [])) as ContentItem[];

    return { todayHistory, contents };
  } catch (e) {
    console.error(e);
    return { todayHistory: null, contents: [] };
  }
}

export default async function Home() {
  const { todayHistory, contents } = await getHomeData();

  const shuffledContents = shuffleArray(contents || []);

  return (
    <div className="w-full max-w-lg mx-auto min-h-[calc(100vh-3rem)] relative overflow-hidden bg-zinc-50 flex">
      <MainHome todayHistory={todayHistory} contents={shuffledContents} />
    </div>
  );
}
