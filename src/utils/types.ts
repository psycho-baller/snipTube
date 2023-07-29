import type { Chapter } from "get-youtube-chapters";

export type Snip = {
  startTimestamp: number;
  endTimestamp: number;
  videoId: string;
  id: string;
  vidTitle: string;
  title: string; // AI generated title that can be edited
  note: string;
  tags: Tag[];
  createdAt: number;
  updatedAt: number;
};

export type Tag = {
  name: string;
  color?: string;
};

export type Subtitle = {
  start: string;
  dur: string;
  text: string;
};

export type VidDetails = {
  transcript: Subtitle[];
  chapters: Chapter[];
  title: string;
};

export type sortByOptions = "Newest" | "Oldest" | "A-Z" | "Z-A" | "End time" | "Tag (A-Z)" | "Tag (Z-A)";
