import { getTime } from "./utils";
import { Snip } from "./types";
import { useState } from "react";

let currentVideo = "";
let currentVideoBookmarks = [] as Snip[];
let youtubePlayer: HTMLVideoElement;
let youtubeLeftControls;
let defaultSnipLength = 20;

const newVideoLoaded = async () => {
  // make sure currentVideo is set
  // if (!currentVideo) {
  //   currentVideo = window.location.href.split("v=")[1] || "";
  // }

  const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

  currentVideoBookmarks = await fetchBookmarks();

  if (!bookmarkBtnExists) {
    // create an svg element
    const bookmarkBtn = document.createElement("button");
    bookmarkBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Plus_Circle"> <path id="Vector" d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`;

    bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    bookmarkBtn.title = "Create a snip";
    bookmarkBtn.style.display = "flex";
    bookmarkBtn.style.alignItems = "center";

    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;

    youtubeLeftControls?.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  }
};


function fetchBookmarks(): any[] | PromiseLike<any[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideo], (obj) => {
      resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    });
  });
}

async function addNewBookmarkEventHandler(this: HTMLButtonElement) {
  const date = new Date();
  const currentTime = youtubePlayer.currentTime;
  const newBookmark: Snip = {
    startTimestamp: currentTime - defaultSnipLength,
    endTimestamp: currentTime,
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
    videoId: currentVideo,
    id: currentVideo + (date.getTime()).toString(),
    title: document.title,
    notes: "this is a note I wrote",
    tags: [],
  }

  currentVideoBookmarks = await fetchBookmarks();
  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.endTimestamp - b.endTimestamp))
  });

}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, videoId } = obj;

  if (type === "NEW") {
    currentVideo = videoId;
    newVideoLoaded();
  } else if (type === "PLAY") {
    youtubePlayer.currentTime = value;
  } else if (type === "DELETE") {
    currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.endTimestamp != value);
    chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

    response(currentVideoBookmarks);
  }
});


newVideoLoaded();