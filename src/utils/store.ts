import { create } from 'zustand';
import type { Snip } from '~utils/types';
import { setSnips } from './storage';

type State = {
  snips: Snip[];
};

type Actions = {
  addSnip?: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  // updateSnip: (snip: Snip) => void;
  setSnips?: (snips: Snip[]) => void;
};

export const useSnipsStore = create<State & Actions>((set) => ({
  snips: [],
  addSnip: (snip) => set((state) => {
    const snips = [...state.snips, snip] as Snip[];
    setSnips(snips);
    return { snips };
  }),
  removeSnip: (snipId) => set((state) => {
    const snips = state.snips.filter((s: Snip) => s.id !== snipId) as Snip[];
    setSnips(snips);
    return { snips };
  }),
  setSnips: (snips) => set((state) => {
    setSnips(snips);
    return { snips };
  }),
  // updateSnip: (snip) => set((state) => ({ snips: state.snips.map((s) => (s.id === snip.id ? snip : s)) })),
}));

export const useAllSnipsStore = create<State & Actions>((set) => ({
  snips: [],
  removeSnip: (snipId) => set((state) => {
    const vidId = snipId.split("-")[0];
    const snips = state.snips.filter((s: Snip) => s.id !== snipId) as Snip[];
    setSnips(snips, vidId);
    return { snips };
  }),
  setSnips: (snips) => set((state) => {
    // setAllSnips(snips);
    return { snips };
  }),

}));
