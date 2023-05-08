export type Snip = {
  startTimestamp: number;
  endTimestamp: number;
  notes?: string;
  videoId: string;
  id: string;
  vidTitle: string;
  title?: string;
  tags?: {
    name: string;
    color?: string;
  }[];
  createdAt: number;
  updatedAt: number;
};
