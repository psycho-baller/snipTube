import { create } from "zustand";
import type { Snip } from "~utils/types";
import { getDefaultSnipLength, setDefaultSnipLength, setSnips } from "./storage";

type State = {
  snips: Snip[];
};

type Actions = {
  addSnip?: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  // updateSnip: (snip: Snip) => void;
  setSnips?: (snips: Snip[]) => void;
};

type SettingsState = {
  defaultLength: number;
  addDetailsAfterSnipping: boolean;
};

type SettingsActions = {
  setDefaultLength: (length: number) => void;
  setAddDetailsAfterSnipping: (addDetails: boolean) => void;
};

type contentScriptState = {
  showOverlay: boolean;
  snipNote: string;
  snipTags: string[];
};

type contentScriptActions = {
  setShowOverlay: (showOverlay: boolean) => void;
};

export const useSnipsStore = create<State & Actions>((set, get) => ({
  snips: [],
  addSnip: async (snip) => {
    const snips = [...get().snips, snip] as Snip[];
    await setSnips(snips, snip.videoId);
    set({ snips });
  },
  removeSnip: async (snipId) => {
    const snips = get().snips.filter((s: Snip) => s.id !== snipId) as Snip[];
    await setSnips(snips, snipId.split("-")[0]); // vidId = snipId.split("-")[0]
    set({ snips });
  },
  setSnips: async (snips) => {
    await setSnips(snips);
    set({ snips });
  },
  // updateSnip: (snip) => set((state) => ({ snips: state.snips.map((s) => (s.id === snip.id ? snip : s)) })),
}));

export const useAllSnipsStore = create<State & Actions>((set, get) => ({
  snips: [],
  removeSnip: async (snipId) => {
    const snips = get().snips.filter((s: Snip) => s.id !== snipId) as Snip[];
    await setSnips(snips, snipId.split("-")[0]);
    set({ snips });
  },
  setSnips: async (snips) => {
    // await setSnips(snips)
    set({ snips });
  },
}));

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  defaultLength: 30,
  addDetailsAfterSnipping: true,
  setDefaultLength: async (length) => {
    await setDefaultSnipLength(length);
    set({ defaultLength: length });
  },
  setAddDetailsAfterSnipping: (addDetails) => set({ addDetailsAfterSnipping: addDetails }),
}));

export const useContentScriptStore = create<contentScriptState & contentScriptActions>((set) => ({
  showOverlay: false,
  setShowOverlay: (showOverlay) => set({ showOverlay }),
  snipNote: "",
  snipTags: [],
}));
