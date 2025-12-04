export interface ContentItem {
  id: string;
  title: string;
  character: string;
  story: string;
  image: string;
  date: string;
  category: "movie" | "drama" | string;
}

export type ContentsResponse = ContentItem[];
