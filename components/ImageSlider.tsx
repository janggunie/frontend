"use client";

import Image from "next/image";
import { ContentItem } from "@/types/contents";

type Props = {
  contents: ContentItem[];
};

export default function ImageSlider({ contents }: Props) {
  return (
    <div className="w-full">
      {contents.map((item, idx) => (
        <section
          key={item.id}
          className="
            w-full 
            h-[100vh] 
            flex flex-col 
            justify-center 
            items-center 
            snap-start
            px-4
          "
        >
          {/* 콘텐츠 이미지 크게 */}
          <div className="relative w-full max-w-md h-[60vh] rounded-1xl overflow-hidden shadow-lg">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold mt-6 text-center text-zinc-800">
            {item.title}
          </h2>
        </section>
      ))}
    </div>
  );
}
