import type { Snip } from './types';


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
    chrome.storage.sync.get(['videoId'], (result) => {
      resolve(result.videoId);
    });
  });
};


export const setSnips = async (snips: Snip[]) => {
  const videoId = await getVideoId();
  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.set({ [videoId]: JSON.stringify(snips) }, () => {
      resolve();
    });
  });
};

export const getSnips = async () => {
  const videoId = await getVideoId();
  return new Promise<Snip[]>((resolve, reject) => {
    chrome.storage.sync.get([videoId], (result) => {
      resolve(JSON.parse(result[videoId] || "[]"));
    });
  });
}

