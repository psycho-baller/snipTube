import type { Subtitle, VidDetails } from "./types";
import { URL, invalidStartOrEndTimeMessage } from "./constants";

export const getVideoDetails = async (videoId: string) => {
  // check local storage for transcript
  // const transcript = localStorage.getItem(videoId);
  // if (transcript) {
  //   return JSON.parse(transcript) as VidDetails;
  // }
  // const res = await fetch(`http://127.0.0.1:8000/transcript/${videoId}?format=json`);
  // const res = await getSubtitles({ videoID: videoId, lang: 'en' });
  try {
    const res = await fetch(`${URL}/youtube?videoID=${videoId}`, {
      // mode: "no-cors",
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    const data = (await res.json()) as VidDetails;
    // localStorage.setItem(videoId, JSON.stringify(data));
    return data;
    // const transcriptText = data.transcript.map((d) => d.text).join("");
    // return transcriptText;
  } catch (e) {
    console.log("error", e);
    return null;
  }
};

export const getFullSummary = async (transcript: string, title: string, videoId: string) => {
  // check local storage for summarized transcript
  const summary = localStorage.getItem(`${videoId}-summary`);
  if (summary) {
    return summary;
  } else if (summary === "loading") {
    // if it's in the process of being summarized, return empty string
    return "";
  }
  // if it's not in local storage, set it to loading
  localStorage.setItem(`${videoId}-summary`, "loading");
  // encode transcript and title to base64
  const encodedTranscript = Buffer.from(transcript).toString("base64");
  // remove things that don't work with base64 encoding like emojis
  const cleanedTitle = title.replace(/[\uD800-\uDFFF]./g, "");
  const encodedTitle = Buffer.from(cleanedTitle).toString("base64");
  try {
    const res = await fetch(`${URL}/llm/summarize/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: encodedTranscript,
        title: encodedTitle,
      }),
    });
    if (!res.ok) {
      console.log("error", res);
      localStorage.removeItem(`${videoId}-summary`);
      return "";
    }
    const data = (await res.json()) as { summary: string };
    if (data.summary) {
      localStorage.setItem(`${videoId}-summary`, data.summary);
      return data.summary;
    }
  } catch (e) {
    console.log("error", e);
    localStorage.removeItem(`${videoId}-summary`);
    return "";
  }
};

export const getSnipTranscript = async (transcript: Subtitle[] | null, start: number, end: number) => {
  try {
    // ---error handling---
    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript");
    }
    if (!start || !end) {
      throw new Error("No start or end");
    }
    if (
      // 1: Error: start is out of range
      start > parseInt(transcript[transcript.length - 1].start) + parseInt(transcript[transcript.length - 1].dur) ||
      start < 0 || // Error: end is out of range
      end < parseInt(transcript[0].start) ||
      end > parseInt(transcript[transcript.length - 1].start) + parseInt(transcript[transcript.length - 1].dur) ||
      start > end || // Error: start is greater than end
      start === end // Error: start is equal to end
    ) {
      throw new Error(invalidStartOrEndTimeMessage);
    }
    // ---end error handling---

    // increase time range by 2 seconds
    start = start - 2;
    end = end + 2;
    // 2: get transcript text
    let text = "";
    for (let line of transcript) {
      const from_time = parseInt(line.start);
      const to_time = from_time + parseInt(line.dur);

      if ((start <= from_time && end >= from_time) || (start <= to_time && end >= to_time)) {
        text += line.text.replace("\n", " ");
      } else if (to_time > end) {
        return text;
      }
    }
  } catch (e) {
    // catch errors
    console.log(e);
    // handle this error differently (in the content script)
    if (e.message === invalidStartOrEndTimeMessage) {
      return invalidStartOrEndTimeMessage;
    }
    return "";
  }
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
