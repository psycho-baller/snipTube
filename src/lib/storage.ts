import type { Snip } from "./types";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export const setVideoId = async (vidId: string) => {
  await storage.set("videoId", vidId);
};

export const getVideoId = async () => {
  const vidId: string = await storage.get("videoId");
  return vidId;
};

export const setSnips = async (snips: Snip[], vidId: string = undefined) => {
  const videoId: string = vidId ? vidId : await getVideoId();
  await storage.set(videoId, snips);
  return snips;
};

export const getSnips = async (vidId: string = undefined) => {
  const videoId: string = vidId ? vidId : await getVideoId();

  const snips: Snip[] = await storage.get(videoId);
  return snips ?? [];
};

export const getAllSnips = async () => {
  const allStorageData = await storage.getAll();
  const allSnips: Snip[] = [];
  Object.keys(allStorageData).forEach((key) => {
    // check if key is in the format of a video id (11 characters) and if it has a value and make sure it was not already added (sanity check)
    if (key.length === 11 && allStorageData[key] && !allSnips.find((s) => s.id === key)) {
      allSnips.push(...JSON.parse(allStorageData[key]));
    }
  });
  return allSnips;
};

export const setDefaultSnipLength = async (length: number) => {
  await storage.set("defaultSnipLength", length);
  return length;
};

export const getDefaultSnipLength = async () => {
  const defaultSnipLength: number = await storage.get("defaultSnipLength") ?? await setDefaultSnipLength(30);
  return defaultSnipLength;
};

export const setShowAddSnipDetailsFormOnNewSnip = async (show: boolean) => {
  await storage.set("showAddSnipDetailsFormOnNewSnip", show);
  return show;
};

export const getShowOverlayOnNewSnip = async () => {
  const showAddSnipDetailsFormOnNewSnip: boolean = await storage.get("showAddSnipDetailsFormOnNewSnip") ?? await setShowAddSnipDetailsFormOnNewSnip(true);
  return showAddSnipDetailsFormOnNewSnip;
};

export const setPauseVideoOnNewSnip = async (pause: boolean) => {
  await storage.set("pauseVideoOnNewSnip", pause);
  return pause;
};

export const getPauseVideoOnNewSnip = async () => {
  const pauseVideoOnNewSnip: boolean = await storage.get("pauseVideoOnNewSnip") ?? await setPauseVideoOnNewSnip(true);
  return pauseVideoOnNewSnip;
};

export const setUseKeyboardShortcut = async (use: boolean) => {
  await storage.set("useKeyboardShortcut", use);
  return use;
};

export const getUseKeyboardShortcut = async () => {
  const useKeyboardShortcut: boolean = await storage.get("useKeyboardShortcut") ?? await setUseKeyboardShortcut(true);
  return useKeyboardShortcut;
};

export const deleteAllDataFromStorage = async () => {
  await storage.removeAll();

}

// export const getChapters = async () => {
//   return new Promise<Chapter[]>((resolve, reject) => {
//     chrome.storage.sync.get(['chapters'], (result) => {
//       if (!result.chapters) {
//         // set default chapters
//         defineChapters(resolve, reject);
//       }
//       resolve(JSON.parse(result['chapters']));
//     });
//   });
// };

// export const setAllSnips = async (snips: Snip[]) => {
//   const videoIds = snips.map((s) => s.id.split("-")[0]);
//   const uniqueVideoIds = [...new Set(videoIds)];

//   const snipsByVideoId = uniqueVideoIds.map((vidId) => {
//     return snips.filter((s) => s.id.split("-")[0] === vidId);
//   }
//   );
// }
