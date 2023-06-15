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
    // const vidId = window.location.href.split("?")[1]?.split("&").find((p) => p.startsWith("v="))?.split("=")[1];
    // console.log("vidId", vidId);
    chrome.storage.sync.get(['videoId'], (result) => {
      console.log("result vidId", result.videoId);
      if (!result.videoId) reject("No video id");
      resolve(result.videoId);
    });
    // reject("Not a youtube video");
  });
};


export const setSnips = async (snips: Snip[], vidId: string = undefined) => {
  let videoId: string = vidId ? vidId : await getVideoId();

  return new Promise<void>((resolve, reject) => {
    if (!videoId) reject("No video id");
    chrome.storage.sync.set({ [videoId]: JSON.stringify(snips) }, () => {
      resolve();
    });
  })
};


export const getSnips = async () => {
  const videoId = await getVideoId();
  console.log("videoId in getSnips", videoId);
  return new Promise<Snip[]>((resolve, reject) => {
    if (!videoId) reject("No video id");
    chrome.storage.sync.get([videoId], (result) => {
      console.log("result in getSnips", JSON.parse(result[videoId]));
      resolve(JSON.parse(result[videoId] || "[]"));
    });
  });
}


export const getAllSnips = async () => {
  return new Promise<Snip[]>((resolve, reject) => {
    chrome.storage.sync.get(null, (result) => {
      const snips: Snip[] = [];
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) { // check if key is not inherited
          const element = result[key];
          snips.push(...JSON.parse(element));
        }
      }
      resolve(snips);
    });
  });
}