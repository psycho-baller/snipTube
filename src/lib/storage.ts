import type { Snip } from "./types";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export async function setVideoId(vidId: string): Promise<void> {
  await storage.set("videoId", vidId);
}

export async function getVideoId(): Promise<string> {
  const vidId: string = await storage.get("videoId");
  return vidId;
}

export async function setSnips(snips: Snip[], vidId: string = undefined): Promise<Snip[]> {
  const videoId: string = vidId ? vidId : await getVideoId();
  await storage.set(videoId, snips);
  return snips;
}

export async function getSnips(vidId: string = undefined): Promise<Snip[]> {
  const videoId: string = vidId ? vidId : await getVideoId();

  const snips: Snip[] = await storage.get(videoId);
  return snips ?? [];
}

export async function getAllSnips(): Promise<Snip[]> {
  const allStorageData = await storage.getAll();
  const allSnips: Snip[] = [];
  Object.keys(allStorageData).forEach((key) => {
    // check if key is in the format of a video id (11 characters) and if it has a value and make sure it was not already added (sanity check)
    if (key.length === 11 && allStorageData[key] && !allSnips.find((s) => s.id === key)) {
      allSnips.push(...JSON.parse(allStorageData[key]));
    }
  });
  return allSnips;
}

export async function setDefaultSnipLength(length: number): Promise<number> {
  await storage.set("defaultSnipLength", length);
  return length;
}

export async function getDefaultSnipLength(): Promise<number> {
  const defaultSnipLength: number = await storage.get("defaultSnipLength") ?? await setDefaultSnipLength(30);
  return defaultSnipLength;
}

export async function setShowAddSnipDetailsFormOnNewSnip(show: boolean): Promise<boolean> {
  await storage.set("showAddSnipDetailsFormOnNewSnip", show);
  return show;
}

export async function getShowOverlayOnNewSnip(): Promise<boolean> {
  const showAddSnipDetailsFormOnNewSnip: boolean = await storage.get("showAddSnipDetailsFormOnNewSnip") ?? await setShowAddSnipDetailsFormOnNewSnip(true);
  return showAddSnipDetailsFormOnNewSnip;
}

export async function setPauseVideoOnNewSnip(pause: boolean): Promise<boolean> {
  await storage.set("pauseVideoOnNewSnip", pause);
  return pause;
}

export async function getPauseVideoOnNewSnip(): Promise<boolean> {
  const pauseVideoOnNewSnip: boolean = await storage.get("pauseVideoOnNewSnip") ?? await setPauseVideoOnNewSnip(true);
  return pauseVideoOnNewSnip;
}

export async function setUseKeyboardShortcut(use: boolean): Promise<boolean> {
  await storage.set("useKeyboardShortcut", use);
  return use;
}

export async function getUseKeyboardShortcut(): Promise<boolean> {
  const useKeyboardShortcut: boolean = await storage.get("useKeyboardShortcut") ?? await setUseKeyboardShortcut(true);
  return useKeyboardShortcut;
}

export async function deleteAllDataFromStorage(): Promise<void> {
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
