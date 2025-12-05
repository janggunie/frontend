"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BiUser,
  BiChevronRight,
  BiLogOut,
  BiCog,
  BiTrophy,
  BiBookBookmark,
} from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";

export default function MyPage() {
  const router = useRouter();

  // Mock Data (나중에 API 데이터로 교체 가능)
  const stats = [
    { label: "읽은 이야기", value: 12, icon: <BiBookBookmark /> },
    { label: "퀴즈 만점", value: 5, icon: <BiTrophy /> },
    { label: "수집품", value: 8, icon: "🏺" },
  ];

  const menuItems = [
    { label: "내 정보 수정", icon: <BiUser size={20} />, onClick: () => {} },
    {
      label: "알림 설정",
      icon: <IoSettingsOutline size={20} />,
      onClick: () => {},
    },
    { label: "고객센터", icon: "🎧", onClick: () => {} },
  ];

  return (
    <div className="w-full max-w-lg mx-auto h-full bg-zinc-50 relative flex flex-col overflow-hidden font-sans">
      {/* 1. 상단 헤더 */}
      <div className="px-6 py-4 bg-zinc-50 shrink-0 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-zinc-800">마이페이지</h1>
        <button className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-full hover:bg-zinc-200/50">
          <BiCog size={24} />
        </button>
      </div>

      {/* 2. 메인 컨텐츠 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-10">
        {/* 프로필 카드 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-zinc-100 mb-6 flex flex-col items-center animate-[fade-up-soft_0.5s_ease-out] relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent opacity-50" />

          <div className="relative w-28 h-28 mb-5 group cursor-pointer z-10">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md relative bg-zinc-50">
              <Image
                src="/favicon/favicon.svg"
                alt="프로필"
                fill
                className="object-contain p-2"
              />
            </div>
            {/* 편집 아이콘 뱃지 */}
            <div className="absolute bottom-0 right-0 bg-zinc-900 text-white p-2 rounded-full shadow-md border-2 border-white">
              <BiUser size={14} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-1 z-10">
            장군이 유저
          </h2>
          <p className="text-sm text-zinc-500 font-medium z-10 text-center">
            조선의 역사와 이야기 속을 여행하는 중
          </p>

          <div className="mt-5 flex gap-2 z-10">
            <span className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-full shadow-sm">
              LV. 3 역사 탐험가
            </span>
          </div>
        </div>

        {/* 활동 통계 (Stats) */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-[fade-up-soft_0.6s_ease-out]">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-zinc-300 hover:shadow-md transition-all duration-300 cursor-default group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-zinc-800">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex flex-col gap-3 animate-[fade-up-soft_0.7s_ease-out]">
          <span className="text-xs font-bold text-zinc-400 ml-1">
            계정 관리
          </span>
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left group
                   ${
                     idx !== menuItems.length - 1
                       ? "border-b border-zinc-50"
                       : ""
                   }
                 `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 group-hover:text-zinc-800 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-zinc-700 font-bold text-[15px] group-hover:text-zinc-900">
                    {item.label}
                  </span>
                </div>
                <BiChevronRight className="text-zinc-300 text-xl group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button className="w-full mt-8 py-4 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-medium animate-[fade-up-soft_0.8s_ease-out]">
          <BiLogOut size={18} />
          <span>로그아웃</span>
        </button>

        <p className="text-center text-[10px] text-zinc-300 mt-2 pb-8">
          App Version 1.0.2
        </p>
      </div>
    </div>
  );
}
