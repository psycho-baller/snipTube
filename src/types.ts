export type Snip = {
  startTimestamp: number;
  endTimestamp: number;
  notes?: string;
  videoId: string;
  id: string;
  vidTitle: string;
  title?: string;
  tags?: Tag[];
  createdAt: number;
  updatedAt: number;
};

export type Tag = {
  name: string;
  color?: string;
};