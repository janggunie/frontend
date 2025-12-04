// types/simulation.ts

export interface Theme {
  theme_key: string;
  title: string;
  background: string;
  auto_query: string;
  history_description: string;
}

export interface StoryScene {
  scene: string;
  choices?: Record<string, string> | null;
  is_final: boolean;
}

export interface StoryMeta {
  theme_key: string;
  auto_query: string;
  history_description: string;
}

// startStory 액션의 반환 타입
export interface StartStoryResult {
  error?: string;
  meta?: StoryMeta;
  story?: StoryScene[];
}

// nextStory 액션의 파라미터 타입
export interface NextStoryParams {
  theme: string;
  previousSummaries: string;
  userChoice: string;
  turn: number;
}

// nextStory 액션의 반환 타입
export interface NextStoryResult extends StoryScene {
  error?: string;
  meta?: StoryMeta | null;
}
