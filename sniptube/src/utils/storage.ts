import type { Snip } from './types';
import { type VideoDetails } from 'youtube-caption-extractor';
import parseYouTubeChapters, { type Chapter } from 'get-youtube-chapters';
interface Subtitle {
  start: string;
  dur: string;
  text: string;
}

interface Res {
  transcript: Subtitle[];
  chapters: Chapter[];
}

export const getTranscript = async (videoId: string) => {
  // check local storage for transcript
  const transcript = localStorage.getItem(videoId);
  if (transcript) {
    const data = JSON.parse(transcript) as { start: number, dur: number, text: string }[];
    return data.map((d) => d.text).join(" ");
  }
  // const res = await fetch(`http://127.0.0.1:8000/transcript/${videoId}?format=json`);
  // const res = await getSubtitles({ videoID: videoId, lang: 'en' });
  try {
    const res = await fetch(
      `http://localhost:1947/youtube?videoID=${videoId}`, {
      mode: "no-cors",
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "application/json",
      // },
    }) as Response;
    console.log("res", res);
    if (!res.ok) {
      return "";
    }
    const data = await res.json() as Res;
    console.log("data", data);
    const transcriptText = data.transcript.map((d) => d.text).join(" ");
    localStorage.setItem(videoId, JSON.stringify(data));
    // return data.text;
    return transcriptText;

  } catch (e) {
    console.log("error", e);
    return "";
  }
};

export const getFullSummary = async (transcript: string, videoId: string) => {
  // check local storage for summarized transcript
  const summary = localStorage.getItem(`${videoId}-summary`);
  if (summary) {
    return summary;
  }
  const res = await fetch(`http://127.0.0.1:8000/summarized/?format=json&transcript=${transcript}`);
  const data = await res.json();
  if (data.error) {
    return "";
  }
  localStorage.setItem(`${videoId}-summary`, data.summary);
  return data.summary;
};

// const defineChapters = async (resolve: (value: Chapter[]) => void, reject: (reason?: any) => void) => {
//   // get description from youtube
//   const description = document.getElementById("description")?.innerText;
//   if (!description) {
//     reject("No description");
//     return;
//   }
//   // parse chapters from description
//   const chapters = parseYouTubeChapters(description) || [];
//   // save chapters to storage
//   chrome.storage.sync.set({ chapters: JSON.stringify(chapters) }, () => {
//     resolve(chapters);
//   });
// };


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
  let videoId: string = vidId ? vidId : await getVideoId();

  return new Promise<void>((resolve, reject) => {
    if (!videoId) {
      reject("No video id");
      return;
    }

    chrome.storage.sync.set({ [videoId]: JSON.stringify(snips) }, () => {
      resolve();
    });
  })
};


export const getSnips = async () => {
  const videoId = await getVideoId();
  console.log("videoId in getSnips", videoId);
  return new Promise<Snip[]>((resolve, reject) => {
    if (!videoId) {
      reject("No video id");
      return;
    }
    chrome.storage.sync.get([videoId], (result) => {
      console.log("result in getSnips", JSON.parse(result[videoId]));
      resolve(JSON.parse(result[videoId] || "[]"));
    });
  });
}


export const getAllSnips = async () => {
  // clear storage
  return new Promise<Snip[]>((resolve, reject) => {
    chrome.storage.sync.get(null, (result) => {
      const snips: Snip[] = [];
      Object.keys(result).forEach((key) => {
        if (key !== "videoId") {
          snips.push(...JSON.parse(result[key]));
        }
      });
      resolve(snips);
    });
  });
}

// export const setAllSnips = async (snips: Snip[]) => {
//   const videoIds = snips.map((s) => s.id.split("-")[0]);
//   const uniqueVideoIds = [...new Set(videoIds)];

//   const snipsByVideoId = uniqueVideoIds.map((vidId) => {
//     return snips.filter((s) => s.id.split("-")[0] === vidId);
//   }
//   );
// }
