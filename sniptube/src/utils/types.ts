export type Snip = {
  startTimestamp: number;
  endTimestamp: number;
  videoId: string;
  id: string;
  vidTitle: string;
  title: string; // AI generated title that can be edited
  notes?: string;
  tags?: Tag[];
  createdAt: number;
  updatedAt: number;
};

export type Tag = {
  name: string;
  color?: string;
};