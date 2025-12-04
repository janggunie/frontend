// app/simulation/action.ts
"use server";

import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import {
  Theme,
  StartStoryResult,
  NextStoryParams,
  NextStoryResult,
} from "@/types/simulation";

// 테마 목록 가져오기
export async function fetchThemes(): Promise<Theme[] | null> {
  try {
    const res = await api.get("/api/v1/simulation/themes");
    console.log("fetchTheme :: ", res.data.themes);
    return res.data.themes;
  } catch (error) {
    console.error("테마 불러오기 오류:", error);
    return null;
  }
}

// 스토리 시작
export async function startStory(theme: string): Promise<StartStoryResult> {
  try {
    const res = await api.post("/api/v1/simulation/start", { theme });
    console.log("startStory :: ", res.data);

    const {
      scene: apiScene,
      theme: themeKey,
      auto_query,
      history_description,
    } = res.data;

    return {
      meta: {
        theme_key: themeKey,
        auto_query,
        history_description,
      },
      story: [
        {
          scene: apiScene.scene,
          choices: apiScene.choices,
          is_final: apiScene.is_final,
        },
      ],
    };
  } catch (error) {
    const err = error as AxiosError<{ detail: string }>;
    return { error: err.response?.data?.detail || "스토리 시작 실패" };
  }
}

// 다음 장면 생성
export async function nextStory({
  theme,
  previousSummaries,
  userChoice,
  turn,
}: NextStoryParams): Promise<NextStoryResult> {
  try {
    const res = await api.post("/api/v1/interactive-story/next", {
      theme,
      previous_summaries: previousSummaries,
      user_choice: userChoice,
      turn,
    });

    console.log("nextStory data :: ", res.data.scene);

    return {
      scene: res.data.scene.scene,
      choices: res.data.scene.choices,
      is_final: res.data.scene.is_final,
      meta: res.data.meta || null,
    };
  } catch (error) {
    const err = error as AxiosError<{ detail: string }>;
    return {
      error: err.response?.data?.detail || "다음 장면 생성 실패",
      scene: "",
      is_final: false,
    };
  }
}
