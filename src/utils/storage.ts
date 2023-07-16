import type { Snip } from "./types";

export const getVideoId = async () => {
  return new Promise<string>((resolve, reject) => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const tab = tabs[0];
    //   if (tab.url && tab.url.includes("youtube.com/watch")) {
    //     const queryParameters = tab.url.split("?")[1];
    //     const urlParameters = new URLSearchParams(queryParameters);
    //     const vidId = urlParameters.get("v");
    //     resolve(vidId || "");
    //   } else {
    //     reject("Not a youtube video");
    //   }
    // });
    // const vidId = window.location.href.split("?")[1]?.split("&").find((p) => p.startsWith("v="))?.split("=")[1];
    // console.log("vidId", vidId);
    chrome.storage.sync.get(["videoId"], (result) => {
      console.log("result vidId", result.videoId);
      if (!result.videoId) {
        reject("Not a youtube video");
        return;
      }
      resolve(result.videoId);
    });
    // reject("Not a youtube video");
  });
};

export const setSnips = async (snips: Snip[], vidId: string = undefined) => {
  const videoId: string = vidId ? vidId : await getVideoId();

  return new Promise<Snip[]>((resolve, reject) => {
    if (!videoId) {
      console.log("No video id");
      reject("No video id");
    }

    chrome.storage.sync.set({ [videoId]: JSON.stringify(snips) }, async () => {
      resolve(snips);
    });
  });
};

export const getSnips = async (vidId: string = undefined) => {
  const videoId: string = vidId ? vidId : await getVideoId();
  console.log("videoId in getSnips", videoId);
  return new Promise<Snip[]>((resolve, reject) => {
    if (!videoId) {
      reject("No video id");
      return;
    }
    chrome.storage.sync.get([videoId], (result) => {
      console.log("result in getSnips", JSON.parse(result[videoId] || "[]"));
      resolve(JSON.parse(result[videoId] || "[]"));
    });
  });
};

export const getAllSnips = async () => {
  return new Promise<Snip[]>((resolve, reject) => {
    chrome.storage.sync.get(null, (result) => {
      const snips: Snip[] = [];
      Object.keys(result).forEach((key) => {
        // check if key is in the format of a video id (11 characters)
        if (key.length === 11 && result[key]) {
          snips.push(...JSON.parse(result[key]));
        }
      });
      resolve(snips);
    });
  });
};

export const setDefaultSnipLength = async (length: number) => {
  return new Promise<number>((resolve, reject) => {
    chrome.storage.sync.set({ defaultSnipLength: length }, () => {
      resolve(length);
    });
  });
};

export const getDefaultSnipLength = async () => {
  return new Promise<number>((resolve, reject) => {
    chrome.storage.sync.get(["defaultSnipLength"], async (result) => {
      if (result.defaultSnipLength === undefined) {
        resolve(await setDefaultSnipLength(30));
      } else {
        resolve(result.defaultSnipLength);
      }
    });
  });
};

export const setShowOverlayOnNewSnip = async (show: boolean) => {
  return new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.set({ showOverlayOnNewSnip: show }, async () => {
      resolve(show);
    });
  });
};

export const getShowOverlayOnNewSnip = async () => {
  return new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(["showOverlayOnNewSnip"], async (result) => {
      if (result.showOverlayOnNewSnip === undefined) {
        // await setShowOverlayOnNewSnip(false);
        resolve(true);
      } else {
        resolve(result.showOverlayOnNewSnip);
      }
    });
  });
};

export const setPauseVideoOnNewSnip = async (pause: boolean) => {
  return new Promise<boolean>((resolve, reject) => {
    // make sure it's called when overlay is true
    if (!getShowOverlayOnNewSnip()) {
      reject("Can't pause video if overlay is not shown");
    }
    chrome.storage.sync.set({ pauseVideoOnNewSnip: pause }, () => {
      resolve(pause);
    });
  });
};

export const getPauseVideoOnNewSnip = async () => {
  return new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(["pauseVideoOnNewSnip"], async (result) => {
      if (result.pauseVideoOnNewSnip === undefined) {
        resolve(true);
      } else {
        resolve(result.pauseVideoOnNewSnip);
      }
    });
  });
};

export const setUseKeyboardShortcut = async (use: boolean) => {
  return new Promise<boolean>((resolve, reject) => {
    // make sure it's called when overlay is true
    chrome.storage.sync.set({ useKeyboardShortcut: use }, () => {
      resolve(use);
    });
  });
};

export const getUseKeyboardShortcut = async () => {
  return new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(["useKeyboardShortcut"], async (result) => {
      if (result.useKeyboardShortcut === undefined) {
        resolve(true);
      } else {
        resolve(result.useKeyboardShortcut);
      }
    });
  });
};

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
