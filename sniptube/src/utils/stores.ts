import { create } from 'zustand';
import type { Snip } from '~utils/types';
import { setSnips } from './storage';

type State = {
  videoId?: string;
  snips: Snip[];
};

type Actions = {
  setVideoId?: (videoId: string) => void;
  addSnip: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  updateSnip: (snip: Snip) => void;
  setSnips?: (snips: Snip[]) => void;
};

export const useSnipsStore = create<State & Actions>((set) => ({
  snips: [],
  addSnip: (snip) => set((state) => ({ snips: [...state.snips, snip] })),
  removeSnip: (snipId) => set((state) => {
    const snips = state.snips.filter((s: Snip) => s.id !== snipId) as Snip[];
    // chrome.storage.sync.set({ [state.videoId]: JSON.stringify(snips) as string } as { [key: string]: string }, () => {
    //   console.log("snip deleted");
    // }) as void;
    setSnips(snips);
    // console.log(state.videoId);
    // chrome.storage.sync.get([state.videoId], (result) => {
    //   console.log('Value currently is ' + result[state.videoId]);
    // });
    return { snips };
  }),
  updateSnip: (snip) => set((state) => ({ snips: state.snips.map((s) => (s.id === snip.id ? snip : s)) })),
  setSnips: (snips) => set((state) => {

    // chrome.storage.sync.set({ [state.videoId]: JSON.stringify(snips) }, () => {
    //   console.log('snips updated');
    //   return { snips };
    // });
    return { snips };
  }),
  setVideoId: (videoId) => set(() => ({ videoId })),
}));

export const useAllSnipsStore = create<State & Actions>((set) => ({
  snips: [],
  addSnip: (snip) => set((state) => ({ snips: [...state.snips, snip] })),
  removeSnip: (snipId) => set((state) => ({ snips: state.snips.filter((snip) => snip.id !== snipId) })),
  updateSnip: (snip) => set((state) => ({ snips: state.snips.map((s) => (s.id === snip.id ? snip : s)) })),
  //   setSnips: (snips) => set(() => {
  //     // get everything from storage
  //     chrome.storage.local.set({ [null]: snips }, () => {] }
  //       console.log('snips updated');
  //     return { snips };
  //   });
  //   return { snips };
  // }
}));
