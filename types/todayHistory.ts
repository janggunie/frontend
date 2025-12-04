// types/todayHistory.ts
export type SillokInfo = {
  king: string;
  year_ad: string;
  sillok_year: string;
  date: string;
  titles: string[];
  sillok_id: string;
};

export type Sillok = {
  info: SillokInfo;
  raw_text: string;
  summary: string;
};

export type HistoryEvent = {
  id: number;
  year: string;
  title: string;
  description: string;
  diff_year: number;
};

export type History = {
  events: HistoryEvent[];
  raw_text: string;
  summary: string;
};

export type TodayHistory = {
  date: string;
  sillok: Sillok | null;
  history: History | null;
  message?: string;
};
