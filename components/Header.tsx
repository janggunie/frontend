"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BiMessageRoundedDots,
  BiBookHeart,
  BiJoystick,
  BiHomeAlt,
  BiX,
} from "react-icons/bi";

const menuItems = [
  { label: "홈으로", path: "/", icon: <BiHomeAlt size={22} /> },
  {
    label: "말벗 (챗봇)",
    path: "/chatbot",
    icon: <BiMessageRoundedDots size={22} />,
  },
  { label: "알음풀이 (퀴즈)", path: "/quiz", icon: <BiBookHeart size={22} /> },
  {
    label: "연희 마당 (시뮬레이션)",
    path: "/simulation",
    icon: <BiJoystick size={22} />,
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 스크롤 감지 (헤더 스타일 변경용)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 메뉴 열렸을 때 바디 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleMenuClick = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* 상단 헤더바: 가운데 max-w-lg 프레임 */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none">
        <div
          className={`
            pointer-events-auto w-full max-w-lg h-14 grid grid-cols-[1fr_auto_1fr] items-center px-4
            transition-all duration-300 ease-in-out
            ${
              scrolled
                ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
                : "bg-transparent"
            }
          `}
        >
          {/* 메뉴 버튼 - 왼쪽 */}
          <div className="flex justify-start">
            <button
              onClick={() => setOpen(true)}
              className="transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <Image
                src="/menugray.svg"
                alt="menu"
                width={36}
                height={36}
                className="w-9 h-9 md:w-11 md:h-11 object-contain"
              />
            </button>
          </div>

          {/* head.svg - 중앙 */}
          <button
            onClick={() => router.push("/")}
            className="transition-transform duration-300 hover:scale-105 active:scale-90"
          >
            <Image
              src="/head.svg"
              alt="head"
              width={110}
              height={32}
              className="h-6 md:h-8 w-auto object-contain"
              priority
            />
          </button>

          {/* 마이페이지 버튼 - 오른쪽 */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/mypage")}
              className="transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <Image
                src="/mypagegray.svg"
                alt="profile"
                width={36}
                height={36}
                className="w-9 h-9 md:w-11 md:h-11 object-contain"
              />
            </button>
          </div>
        </div>
      </header>

      {/* === 사이드바 메뉴 (Drawer) === */}
      <div
        className={`fixed inset-0 z-50 flex justify-center transition-all duration-300 ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* 배경 딤 (Backdrop) */}
        <div
          className={`
            absolute inset-0 bg-black/20 backdrop-blur-sm
            transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setOpen(false)}
        />

        {/* 메뉴 패널 */}
        <div className="w-full max-w-lg h-full relative pointer-events-none">
          <aside
            className={`
              absolute top-0 left-0 h-full w-[75%] max-w-[320px] bg-white shadow-2xl
              pointer-events-auto flex flex-col
              transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
              ${open ? "translate-x-0" : "-translate-x-full"}
              rounded-r-[2rem] overflow-hidden
            `}
          >
            {/* 메뉴 헤더 */}
            <div className="px-6 pt-8 pb-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-400 mb-1">
                  Welcome
                </span>
                <span className="text-xl font-bold text-zinc-900">
                  역사 탐험하기
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 transition-all"
              >
                <BiX size={24} />
              </button>
            </div>

            {/* 메뉴 리스트 */}
            <nav className="flex-1 px-4 overflow-y-auto">
              <ul className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleMenuClick(item.path)}
                        className={`
                          w-full flex items-center gap-2 px-4 py-4 rounded-2xl transition-all duration-200
                          ${
                            isActive
                              ? "bg-zinc-900 text-white shadow-md"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                          }
                        `}
                      >
                        <span
                          className={`${
                            isActive ? "text-white" : "text-zinc-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-bold text-[16px]">
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 하단 장식 */}
            <div className="p-8 mt-auto">
              <div className="w-full h-32 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-3xl flex flex-col items-center justify-center border border-zinc-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="opacity-30 grayscale mb-2 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                <span className="text-[10px] text-zinc-400 font-medium">
                  History Platform v1.0
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
