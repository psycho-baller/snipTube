import { getTime } from "./utils";
import { Snip } from "./types";
import { useState } from "react";

let currentVideo = "";
let currentVideoSnips = [] as Snip[];
let youtubePlayer: HTMLVideoElement;
let firstRightButton;
let defaultSnipLength = 20;

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

  // section 1: add the snips to the video
  await updateVideoSnips();

  // section 2: add a snip button
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
};

function fetchSnips(): Snip[] | PromiseLike<Snip[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideo], (obj) => {
      resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    });
  });
}

async function addNewSnipEventHandler(this: HTMLButtonElement) {
  const date = new Date();
  const currentTime = youtubePlayer.currentTime;
  const newSnip: Snip = {
    startTimestamp: currentTime - defaultSnipLength,
    endTimestamp: currentTime,
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
    videoId: currentVideo,
    id: currentVideo + (date.getTime()).toString(),
    vidTitle: document.title,
    notes: "this is a note I wrote",
    // make it folder based instead of tag based
    tags: [{ "name": "tag1" }, { "name": "tag2" }],
  }

  currentVideoSnips = await fetchSnips();
  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify([...currentVideoSnips, newSnip].sort((a, b) => a.endTimestamp - b.endTimestamp))
  });
  await updateVideoSnips();
}


async function updateVideoSnips() {
  currentVideoSnips = await fetchSnips();
  if (currentVideoSnips.length > 0) {
    youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
    const progressBar = document.getElementById("previewbar");

    currentVideoSnips.forEach((snip) => {
      // if the snip is already on the video, don't add it again
      if (document.getElementById(`snip-${snip.id}`)) {
        return;
      }
      const snipElement = document.createElement("li");
      const tags = snip.tags || [];
      const firstTag = (tags && tags.length > 0) ? tags[0] : undefined;
      snipElement.id = `snip-${snip.id}}`;
      snipElement.style.position = "absolute";
      snipElement.style.top = "0px";
      snipElement.style.left = `${(snip.startTimestamp / youtubePlayer.duration) * 100}%`;
      snipElement.style.width = `${((snip.endTimestamp - snip.startTimestamp) / youtubePlayer.duration) * 100}%`;
      snipElement.style.height = "100%";
      snipElement.style.backgroundColor = firstTag?.color || "yellow";
      snipElement.style.zIndex = "1000";
      snipElement.style.cursor = "pointer";
      snipElement.title = "Click to jump to this snip";

      snipElement.addEventListener("click", () => {
        youtubePlayer.currentTime = snip.startTimestamp;
      });
      progressBar?.appendChild(snipElement);
    });
  }
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

