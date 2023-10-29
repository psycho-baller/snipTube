import type { Snip, SortByOptionsType } from "~lib/types";
import { setDefaultSnipLength, setSnips } from "../lib/storage";
import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type State = {
  snips: Snip[];
  sortBy?: SortByOptionsType;
  selectedTags?: string[];
};

type Actions = {
  addSnip?: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  // updateSnip: (snip: Snip) => void;
  setSnips: (snips: Snip[], vidId?: string) => void;
  setSortBy?: (sortBy: SortByOptionsType) => void;
  setSelectedTags?: (selectedTags: string[]) => void;
  addSelectedTag?: (tag: string) => void;
  removeSelectedTag?: (tag: string) => void;
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
  showAddSnipDetailsForm: boolean;
  snipNote: string;
  snipTags: string[];
  snipLength: number;
  inYoutube: boolean;
  cancelSnipRequest: boolean;
};

type contentScriptActions = {
  setShowAddSnipDetailsForm: (showAddSnipDetailsForm: boolean) => void;
  setInYoutube: (inYoutube: boolean) => void;
  setSnipLength: (snipLength: number) => void;
  setCancelSnipRequest: (cancelSnipRequest: boolean) => void;
};

//TODO: if you wanna persist storage with store - https://docs.pmnd.rs/zustand/integrations/persisting-store-data#how-can-i-use-a-custom-storage-engine
export const useSnipsStore = createWithEqualityFn<State & Actions>()(
  devtools((set, get) => ({
    snips: [],
    sortBy: "Newest",
    selectedTags: [],
    addSnip: async (snip) => {
      const snips = [...get().snips, snip] as Snip[];
      await setSnips(snips, snip.videoId);
      set({ snips });
    },
    removeSnip: async (snipId) => {
      const snips = get().snips.filter((s: Snip) => s.id !== snipId) as Snip[];
      const vidId = snipId.split("-")[0];
      // remove from all snips store as well to keep it in sync and update the DOM
      useAllSnipsStore.getState().removeSnip(snipId);
      await setSnips(snips, vidId);
      set({ snips });
    },
    setSnips: async (snips, vidId) => {
      await setSnips(snips, vidId);
      set({ snips });
    },
    setSortBy: (sortBy) => set({ sortBy }),
    setSelectedTags: (selectedTags) => set({ selectedTags }),
    addSelectedTag: (tag) => set((state) => ({ selectedTags: [...state.selectedTags, tag] })),
    removeSelectedTag: (tag) => set((state) => ({ selectedTags: state.selectedTags.filter((t) => t !== tag) })),
    // updateSnip: (snip) => set((state) => ({ snips: state.snips.map((s) => (s.id === snip.id ? snip : s)) })),
  })),
  shallow
);

export const useAllSnipsStore = createWithEqualityFn<State & Actions>()(
  devtools((set, get) => ({
    snips: [],
    removeSnip: async (snipId) => {
      const snips = get().snips.filter((s: Snip) => s.id !== snipId) as Snip[];
      // await setSnips(snips, snipId.split("-")[0]);
      set({ snips });
    },
    setSnips: async (snips) => {
      set({ snips });
    },
  })),
  shallow
);

export const useSettingsStore = createWithEqualityFn<SettingsState & SettingsActions>()(
  devtools((set, get) => ({
    defaultLength: 30,
    addDetailsAfterSnipping: true,
    setDefaultLength: async (length) => {
      await setDefaultSnipLength(length);
      set({ defaultLength: length });
    },
    setAddDetailsAfterSnipping: (addDetails) => set({ addDetailsAfterSnipping: addDetails }),
  })),
  shallow
);

export const useContentScriptStore = createWithEqualityFn<contentScriptState & contentScriptActions>()(
  devtools((set) => ({
    showAddSnipDetailsForm: false,
    setShowAddSnipDetailsForm: (showAddSnipDetailsForm) => set({ showAddSnipDetailsForm }),
    snipNote: "",
    snipTags: [],
    snipLength: 30,
    setSnipLength: (snipLength) => set({ snipLength }),
    inYoutube: false,
    setInYoutube: (inYoutube) => set({ inYoutube }),
    cancelSnipRequest: false,
    setCancelSnipRequest: (cancelSnipRequest) => set({ cancelSnipRequest }),
  })),
  shallow
);
