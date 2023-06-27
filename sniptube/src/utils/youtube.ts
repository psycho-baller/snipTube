import type { VidDetails } from "./types";

export const getVideoDetails = async (videoId: string) => {
  // check local storage for transcript
  const transcript = localStorage.getItem(videoId);
  if (transcript) {
    return JSON.parse(transcript) as VidDetails;
  }
  // const res = await fetch(`http://127.0.0.1:8000/transcript/${videoId}?format=json`);
  // const res = await getSubtitles({ videoID: videoId, lang: 'en' });
  try {
    const res = await fetch(
      `http://localhost:1947/youtube?videoID=${videoId}`, {
      method: "GET",
    });
    if (!res.ok) {
      return "";
    }
    const data = await res.json() as VidDetails;
    localStorage.setItem(videoId, JSON.stringify(data));
    return data;
    // const transcriptText = data.transcript.map((d) => d.text).join("");
    // return transcriptText;

  } catch (e) {
    console.log("error", e);
    return "";
  }
};

export const getFullSummary = async (transcript: string, title: string, videoId: string) => {
  // check local storage for summarized transcript
  const summary = localStorage.getItem(`${videoId}-summary`);
  if (summary) {
    return summary;
  }
  // encode transcript and title to base64
  const encodedTranscript = Buffer.from(transcript).toString("base64");
  const encodedTitle = Buffer.from(title).toString("base64");
  const res = await fetch(`http://127.0.0.1:8000/summary?title=${encodedTitle}&transcript=${encodedTranscript}&format=json`, {
    method: "GET",
    // mode: "no-cors",
    // // headers: {
    // //   "Content-Type": "application/json",
    // // },
  });
  if (!res.ok) {
    console.log("error", res);
    return "";
  }
  const data = await res.json() as { summary: string };
  if (data.summary) {
    localStorage.setItem(`${videoId}-summary`, data.summary);
    return data.summary;
  }
  return "";
};

export const getSnipTranscript = (videoId: string, start: number, end: number) => {
  // check local storage for details given videoId
  const details = localStorage.getItem(videoId);
  if (!details) {
    return "";
  }
  const { transcript } = JSON.parse(details) as VidDetails;

  // error handling
  if (!start || !end) {
    return "";
  }
  if (
    ( // 1: Error: start is out of range
      start > parseInt(transcript[transcript.length - 1].start) +
      parseInt(transcript[transcript.length - 1].dur) ||
      start < 0
    ) || ( // Error: end is out of range
      end < parseInt(transcript[0].start) ||
      end >
      parseInt(transcript[transcript.length - 1].start) +
      parseInt(transcript[transcript.length - 1].dur)
    ) || (start > end) // Error: start is greater than end
    || (start === end) // Error: start is equal to end
  ) {
    return "";
  }

  // 2: get transcript text
  let text = '';
  for (let line of transcript) {
    const from_time = parseInt(line.start);
    const to_time = from_time + parseInt(line.dur);

    if (
      (start <= from_time && end >= from_time) ||
      (start <= to_time && end >= to_time)
    ) {
      text += line.text.replace('\n', ' ');
    } else if (to_time > end) {
      return text;
    }
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

