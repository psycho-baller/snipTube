import type { Snip } from "./types";
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/*"],
  run_at: "document_end",
}

let currentVideo = "";
let currentVideoSnips = [] as Snip[];
let youtubePlayer: HTMLVideoElement;
let firstRightButton;
let defaultSnipLength = 20;
let previewBar: HTMLUListElement | null;


const newVideoLoaded = async () => {
  const snipButtonExists = document.getElementsByClassName("snip-btn")[0];

  // get the current video id if it doesn't exists
  if (!currentVideo) {
    const url = window.location.href;
    if (!url.includes("youtube.com/watch")) {
      return;
    }
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    currentVideo = urlParameters.get("v") as string;
  }

  // section 1: add a snip button
  if (!snipButtonExists) {
    // create an svg element
    const snipBtn = document.createElement("button");
    snipBtn.innerHTML = `<svg style="padding: 2px; padding-bottom: 4px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Plus_Circle"> <path id="Vector" d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`;

    snipBtn.className = "snip-btn" + " ytp-button";
    snipBtn.title = "Create a snip";
    snipBtn.style.display = "inline-flex";
    snipBtn.style.alignItems = "center";
    snipBtn.style.justifyContent = "center";

    // get the first button in the right side of the video
    firstRightButton = document.getElementsByClassName("ytp-right-controls")[0]?.getElementsByClassName("ytp-button")[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;

    // add it before the first button
    firstRightButton?.parentElement?.insertBefore(snipBtn, firstRightButton);
    snipBtn.addEventListener("click", addNewSnipEventHandler);
  }

  // section 2: add the snips to the video
  await updateVideoSnips();
};

async function fetchSnips(): Promise<Snip[]> {
  // console.log("fetching snips", currentVideo);
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideo], (obj) => {
      resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    });
  });
}

async function addNewSnipEventHandler(this: HTMLButtonElement) {
  const date = new Date();
  const currentTime = ~~(youtubePlayer.currentTime); // ~~ is a faster Math.floor
  const startTime = currentTime - defaultSnipLength;
  const summary: string = "hello world"
  //await fetch(`http://127.0.0.1:8000/summary/${currentVideo}?start_time=${startTime}&end_time=${currentTime}&format=json`, {
  //   method: "GET",
  // })
  //   .then((response) => response.json())
  //   .then((data) => data.summary)
  const videoTitle = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0]?.textContent as string;
  const newSnip: Snip = {
    vidTitle: videoTitle as string,
    title: summary,
    notes: "this is a note I wrote",
    // make it folder based instead of tag based
    tags: [{ "name": "tag1" }, { "name": "tag2" }],
    startTimestamp: startTime,
    endTimestamp: currentTime,
    id: currentVideo + (date.getTime()).toString(),
    videoId: currentVideo,
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
  }

  currentVideoSnips = await fetchSnips();
  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify([...currentVideoSnips, newSnip].sort((a, b) => a.endTimestamp - b.endTimestamp))
  });
  await updateVideoSnips();
}

async function updateVideoSnips() {
  // console.log("currentVideo", currentVideo);

  currentVideoSnips = await fetchSnips() as Snip[];
  previewBar = document.getElementById("snip-preview-bar") as HTMLUListElement | null;
  previewBar?.remove();
  previewBar = document.createElement("ul") as HTMLUListElement;
  if (currentVideoSnips.length > 0) {
    youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
    previewBar.id = "snip-preview-bar";
    previewBar.style.position = "absolute";
    previewBar.style.top = "0px";
    previewBar.style.left = "0px";
    previewBar.style.width = "100%";
    previewBar.style.height = "100%";
    previewBar.style.zIndex = "1000";
    previewBar.style.transform = "scaleY(0.6)";
    previewBar.style.pointerEvents = "none";
    previewBar.style.display = "flex";
    previewBar.style.flexDirection = "row";
    previewBar.style.justifyContent = "flex-start";
    previewBar.style.alignItems = "flex-start";
    previewBar.style.overflow = "hidden";
    previewBar.style.padding = "0px";
    previewBar.style.margin = "0px";
    previewBar.style.listStyle = "none";
    previewBar.style.backgroundColor = "transparent";
    previewBar.style.border = "none";
    previewBar.style.outline = "none";
    previewBar.style.cursor = "pointer";

    // add it to the progress bar
    const progressBar = document.getElementsByClassName("ytp-progress-bar")[0];
    progressBar.appendChild(previewBar);
  }

  currentVideoSnips.forEach((snip) => {
    // if the snip is already on the video, don't add it again
    // if (document.getElementById(`snip - ${ snip.id }`)) {
    //   return;
    // }
    const snipElement = document.createElement("li");
    const tags = snip.tags || [];
    const firstTag = (tags && tags.length > 0) ? tags[0] : undefined;
    snipElement.id = `snip - ${snip.id}} `;
    snipElement.style.position = "absolute";
    snipElement.style.top = "0px";
    snipElement.style.left = `${(snip.startTimestamp / youtubePlayer.duration) * 100}% `;
    snipElement.style.width = `${((snip.endTimestamp - snip.startTimestamp) / youtubePlayer.duration) * 100}% `;
    snipElement.style.height = "100%";
    snipElement.style.backgroundColor = firstTag?.color || "yellow";
    snipElement.style.zIndex = "1000";
    snipElement.style.cursor = "pointer";
    snipElement.title = "Click to jump to this snip";

    snipElement.addEventListener("click", () => {
      youtubePlayer.currentTime = snip.startTimestamp;
    });
    previewBar?.appendChild(snipElement);
  });
  // if

}

chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
  const { type, value, videoId } = obj;

  if (type === "NEW") {
    currentVideo = videoId;
    await newVideoLoaded();
  } else if (type === "PLAY") {
    youtubePlayer.currentTime = value;
  } else if (type === "DELETE") {
    currentVideoSnips = currentVideoSnips.filter((b) => b.endTimestamp != value);
    chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoSnips) });

    response(currentVideoSnips);
  }

  await newVideoLoaded();
});
