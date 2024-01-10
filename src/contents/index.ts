import type { Snip, Subtitle } from "../lib/types";
import type { PlasmoCSConfig } from "plasmo";
import {
  getDefaultSnipLength,
  getPauseVideoOnNewSnip,
  getShowOverlayOnNewSnip,
  getSnips,
  getUseKeyboardShortcut,
  getVideoId,
  setSnips,
  setVideoId,
} from "~lib/storage";
import { getVideoDetails } from "~lib/youtube";
import { getSnipTranscript } from "~lib/youtube";
import { URL, invalidStartOrEndTimeMessage } from "~lib/constants";
import { useContentScriptStore } from "~stores/sniptube";
// import browser from "webextension-polyfill";
import 'webextension-polyfill-global';

export const config: PlasmoCSConfig = {
  matches: [
    "https://youtu.be/watch*",
    "https://www.youtu.be/watch*",
    "https://www.youtube-nocookie.com/watch*",
    "https://youtube-nocookie.com/watch*",
    "https://www.youtube.com/embed/watch*",
    "https://youtube.com/embed/watch*",
    "https://*.youtube.com/*",
    "https://www.youtube-nocookie.com/embed/*",
  ],
  run_at: "document_idle",
};
let videoId = "";
let youtubePlayer: HTMLVideoElement;
let firstRightButton: HTMLButtonElement;
let previewBar: HTMLUListElement;
let vidTranscript: Subtitle[] = [];
let vidSummary: string;
let vidTitle: string;
let snipBtn: HTMLButtonElement | undefined;
const placeholderSnipId = "placeholder-snip";

const newVideoLoaded = async () => {
  // const len = await getDefaultSnipLength();
  // useSettingsStore.setState({ defaultLength: len });
  // console.log(useSettingsStore.getState().defaultLength, "meow", len);
  snipBtn = document.getElementsByClassName("snip-btn")[0] as HTMLButtonElement | undefined;

  // get the current video id if it doesn't exists
  if (!videoId) {
    const url = window.location.href;
    if (!url.includes("youtube.com/watch")) {
      return;
    }
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    videoId = urlParameters.get("v") as string;
  }

  // useSnipsStore.setState({ videoId });
  // save to storage the current video id
  // chrome.storage.sync.clear();
  await setVideoId(videoId);

  // section 1: add a snip button
  if (!snipBtn) {
    // create an svg element
    snipBtn = document.createElement("button");
    snipBtn.innerHTML = `<svg style="padding: 0.75rem; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><path fill="#ffffff" d="M 312.5 0 L 62.5 0 C 27.082031 0 0 27.082031 0 62.5 L 0 208.332031 C 0 220.832031 8.332031 229.167969 20.832031 229.167969 L 137.5 229.167969 L 158.332031 208.332031 L 89.582031 139.582031 C 81.25 131.25 81.25 118.75 89.582031 110.417969 C 97.917969 102.082031 110.417969 102.082031 118.75 110.417969 L 187.5 179.167969 L 256.25 110.417969 C 264.582031 102.082031 277.082031 102.082031 285.417969 110.417969 C 293.75 118.75 293.75 131.25 285.417969 139.582031 L 216.667969 208.332031 L 237.5 229.167969 L 354.167969 229.167969 C 366.667969 229.167969 375 220.832031 375 208.332031 L 375 62.5 C 375 27.082031 347.917969 0 312.5 0 Z M 312.5 0 " fill-opacity="1" fill-rule="nonzero"/><path fill="#ffffff" d="M 110.417969 256.25 C 102.082031 252.082031 93.75 250 83.332031 250 C 47.917969 250 20.832031 277.082031 20.832031 312.5 C 20.832031 347.917969 47.917969 375 83.332031 375 C 118.75 375 145.832031 347.917969 145.832031 312.5 C 145.832031 302.082031 143.75 293.75 139.582031 285.417969 L 187.5 237.5 L 235.417969 285.417969 C 231.25 293.75 229.167969 302.082031 229.167969 312.5 C 229.167969 347.917969 256.25 375 291.667969 375 C 327.082031 375 354.167969 347.917969 354.167969 312.5 C 354.167969 277.082031 327.082031 250 291.667969 250 C 281.25 250 272.917969 252.082031 264.582031 256.25 L 237.5 229.167969 L 137.5 229.167969 Z M 83.332031 333.332031 C 70.832031 333.332031 62.5 325 62.5 312.5 C 62.5 300 70.832031 291.667969 83.332031 291.667969 C 95.832031 291.667969 104.167969 300 104.167969 312.5 C 104.167969 325 95.832031 333.332031 83.332031 333.332031 Z M 291.667969 291.667969 C 304.167969 291.667969 312.5 300 312.5 312.5 C 312.5 325 304.167969 333.332031 291.667969 333.332031 C 279.167969 333.332031 270.832031 325 270.832031 312.5 C 270.832031 300 279.167969 291.667969 291.667969 291.667969 Z M 291.667969 291.667969 " fill-opacity="1" fill-rule="nonzero"/></svg>`;

    snipBtn.className = "snip-btn" + " ytp-button";
    snipBtn.title = "Create a snip (s)";
    snipBtn.style.display = "inline-flex";
    snipBtn.style.alignItems = "center";

    // get the first button in the right side of the video
    firstRightButton = document
      .getElementsByClassName("ytp-right-controls")[0]
      ?.getElementsByClassName("ytp-button")[0] as HTMLButtonElement;
    youtubePlayer = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;

    // add it before the first button
    firstRightButton?.parentElement?.insertBefore(snipBtn, firstRightButton);
    snipBtn.addEventListener("click", addNewSnipEventHandler);

    // if user clicks 's' then add a snip (if they have that setting enabled)
    async function addSnipUsingKeyboardShortcut(e: KeyboardEvent) {
      const userClickedTheSnipHotkey = e.key === "s";
      const isTypingInTextArea = document.activeElement instanceof HTMLTextAreaElement;
      const isTypingInInput = document.activeElement instanceof HTMLInputElement;
      const isTypingInComment = document.activeElement.id === "contenteditable-root";
      const isTyping = isTypingInTextArea || isTypingInInput || isTypingInComment;

      if (useKeyboardShortcut && userClickedTheSnipHotkey && !isTyping) {
        await addNewSnipEventHandler();
      }
    }

    const useKeyboardShortcut = await getUseKeyboardShortcut();
    // TODO: use the built in keyboard shortcut functionality instead of this
    document.addEventListener("keydown", addSnipUsingKeyboardShortcut);
    // TODO: remove event listener when video is closed
  }

  // section 2: add the snips to the video
  await updateVideoSnips();

  const { transcript, title } = await getVideoDetails(videoId);
  // // vidTranscript = transcript?.map((d) => d.text).join(" ") || "";
  vidTranscript = transcript;
  vidTitle = title //document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].textContent;
  vidSummary = ""; // await getFullSummary(vidTranscript, vidTitle, videoId);
};

async function addNewSnipEventHandler() {
  // TODO: figure out how I want the process to work
  // define some variables
  const date = new Date();
  const currentTime = ~~youtubePlayer.currentTime; // ~~ is a faster Math.floor

  // get their values depending on if the user wants to show the overlay or not
  let summary = "";
  let startTime = 0;
  let snipTranscript = "";

  // get the video summary
  const { snipNote, snipTags, snipLength } = await new Promise<{
    snipNote: string;
    snipTags: string[];
    snipLength: number;
  }>(async (resolve, reject) => {
    // if user doesn't want to add details after snipping, resolve with empty note and tags
    const autoAddDetails = !(await getShowOverlayOnNewSnip());
    console.log("autoAddDetails", autoAddDetails);
    if (autoAddDetails) {
      const defaultSnipLength = await getDefaultSnipLength();
      // startTime = currentTime - defaultSnipLength;
      // if (vidTranscript.length > 0) {
      //   snipTranscript = await getSnipTranscript(vidTranscript, startTime, currentTime);
      //   if (snipTranscript === invalidStartOrEndTimeMessage) {
      //     reject(invalidStartOrEndTimeMessage);
      //   }
      //   // if there exists a transcript, use it to get the summary, otherwise use the title
      //   const encodedTranscript = Buffer.from(snipTranscript).toString("base64");
      //   // remove things that don't work with base64 encoding like emojis
      //   const cleanedTitle = vidTitle.replace(/[\uD800-\uDFFF]./g, "");
      //   const encodedTitle = Buffer.from(cleanedTitle).toString("base64");
      //   const encodedSummary = vidSummary ? Buffer.from(vidSummary).toString("base64") : "";
      //   // summary = await fetch(`${URL}/llm/summarize/snip`, {
      //   //   method: "POST",
      //   //   headers: {
      //   //     "Content-Type": "application/json",
      //   //   },
      //   //   body: JSON.stringify({
      //   //     transcript: encodedTranscript,
      //   //     title: encodedTitle,
      //   //     // summary: encodedSummary,
      //   //   }),
      //   // })
      //   //   .then((response) => response.json())
      //   //   .then((data) => data.summary);
      //   // resolve with the empty note and tags
      //   resolve({
      //     snipNote: "",
      //     snipTags: [],
      //     snipLength: defaultSnipLength,
      //   });
      // } else {
      // if there is no transcript
      resolve({
        snipNote: "",
        snipTags: [],
        snipLength: defaultSnipLength,
      });
      // }
    } else {
      // otherwise, show the AddSnipDetailsForm and wait for the user to add details
      useContentScriptStore.setState({ showAddSnipDetailsForm: true });
      // check if user wants to pause video on new snip
      if (await getPauseVideoOnNewSnip()) {
        youtubePlayer.pause();
      }

      // this is subscribing to the store, so it will run every time the store updates
      useContentScriptStore.subscribe(async (state) => {
        // unpause the video if it was paused
        if (await getPauseVideoOnNewSnip()) {
          youtubePlayer.play();
        }
        // if the user closes the form, resolve with empty strings
        if (!state.showAddSnipDetailsForm && state.cancelSnipRequest) {
          // stop running this function
          useContentScriptStore.setState({ cancelSnipRequest: false });
          reject("User cancelled snip creation");
        } else if (!state.showAddSnipDetailsForm) {
          resolve({
            snipNote: state.snipNote,
            snipTags: state.snipTags,
            snipLength: state.snipLength,
          });
        }
      });
    }
  });

  startTime = currentTime - snipLength;
  const callingConcurrently = !addPlaceholderSnipToPreviewBar(startTime, currentTime);
  if (callingConcurrently) {
    // TODO: show toast message
    return;
  }

  // if there exists a transcript, use it to get the summary, otherwise use the title
  if (vidTranscript.length > 0) {
    snipTranscript = await getSnipTranscript(vidTranscript, startTime, currentTime);
    if (snipTranscript === invalidStartOrEndTimeMessage) {
      return;
    }
    const encodedTranscript = Buffer.from(snipTranscript).toString("base64");
    // remove things that don't work with base64 encoding like emojis
    const cleanedTitle = vidTitle.replace(/[\uD800-\uDFFF]./g, "");
    const encodedTitle = Buffer.from(cleanedTitle).toString("base64");
    const encodedSummary = vidSummary ? Buffer.from(vidSummary).toString("base64") : "";
    summary = await fetch(`${URL}/llm/summarize/snip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: encodedTranscript,
        title: encodedTitle,
        // summary: encodedSummary,
      }),
    })
      .then((response) => response.json())
      .then((data) => data.summary);
  } else {
    // if there is no transcript
    summary = vidTitle;
  }
  const newSnip: Snip = {
    vidTitle: vidTitle as string,
    title: summary,
    note: snipNote,
    // make it folder based instead of tag based
    tags: snipTags.map((tag) => ({ name: tag })),
    startTimestamp: startTime,
    endTimestamp: currentTime,
    // join the video id with the current time to make a unique id
    id: videoId + "-" + currentTime,
    videoId: videoId || (await getVideoId()),
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
  };
  getSnips().then((snips) =>
    setSnips(
      [...snips, newSnip].sort((a, b) => a.endTimestamp - b.endTimestamp),
      videoId
    ).then((newSnips) => {
      updateVideoSnips(newSnips);
      removePlaceholderSnipFromPreviewBar();
    }
  ));
}

async function updateVideoSnips(snips?: Snip[]) {
  // console.log("videoId", videoId);

  // TODO: Optimize
  previewBar = document.getElementById("snip-preview-bar") as HTMLUListElement | null;
  previewBar?.remove();
  previewBar = document.createElement("ul") as HTMLUListElement;
  youtubePlayer = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;
  previewBar.id = "snip-preview-bar";
  previewBar.style.position = "absolute";
  previewBar.style.top = "0px";
  previewBar.style.left = "0px";
  previewBar.style.width = "100%";
  previewBar.style.height = "100%";
  previewBar.style.zIndex = "1000";
  previewBar.style.transform = "scaleY(0.6)";
  // on hover transform scale to 1
  // previewBar
  previewBar.style.transition = "transform 0.2s ease-in-out";
  // previewBar.style.transformOrigin = "top left";

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

  if (!snips) {
    snips = await getSnips();
  }
  snips.forEach((snip) => {
    const { startTimestamp, endTimestamp, tags = [], id } = snip;
    // if the snip is already on the video, don't add it again
    if (document.getElementById(`snip-${id}`)) {
      return;
    }
    const snipElement = document.createElement("li");
    const firstTag = tags && tags.length > 0 ? tags[0] : undefined;
    snipElement.id = `snip-${id}} `;
    snipElement.style.position = "absolute";
    snipElement.style.top = "0px";
    snipElement.style.left = `${(startTimestamp / youtubePlayer.duration) * 100}% `;
    snipElement.style.width = `${((endTimestamp - startTimestamp) / youtubePlayer.duration) * 100}% `;
    snipElement.style.height = "100%";
    snipElement.style.backgroundColor = firstTag?.color || "hsl(161deg 55% 66%)";
    snipElement.style.zIndex = "1000";
    snipElement.style.cursor = "pointer";
    snipElement.title = "Click to jump to this snip";

    // snipElement.addEventListener("click", () => {
    //   youtubePlayer.currentTime = startTimestamp;
    // });
    previewBar?.appendChild(snipElement);
  });
}

// snip functions
function addPlaceholderSnipToPreviewBar(startTimestamp: number, endTimestamp: number): boolean {
  if (document.getElementById(placeholderSnipId)) {
    return false;
  }
  const snipElement = document.createElement("li");
  snipElement.id = placeholderSnipId;
  snipElement.style.position = "absolute";
  snipElement.style.top = "0px";
  snipElement.style.left = `${(startTimestamp / youtubePlayer.duration) * 100}%`;
  snipElement.style.width = `${((endTimestamp - startTimestamp) / youtubePlayer.duration) * 100}%`;
  snipElement.style.height = "100%";
  snipElement.style.backgroundColor = "hsl(161deg 55% 66%)"
  snipElement.style.zIndex = "1000";
  snipElement.style.cursor = "pointer";
  snipElement.title = "Click to jump to this snip";
  previewBar?.appendChild(snipElement);
  return true;
}

function removePlaceholderSnipFromPreviewBar() {
  const placeholderSnip = document.getElementById(placeholderSnipId);
  placeholderSnip?.remove();
}

browser.runtime.onMessage.addListener(async (obj) => {
  const { type, value, vidId } = obj;

  if (type === "NEW") {
    videoId = vidId;
    await newVideoLoaded();
  } else if (type === "PLAY_SNIP") {
    youtubePlayer.currentTime = value;
  } else if (type === "UPDATE_VIDEO_ID") {
    console.log("updating video id");
    videoId = value;
    await setVideoId(value);
  } else if (type === "UPDATE_SNIPS") {
    await updateVideoSnips(value);
  }
  return true;
});

// let port: browser.Runtime.Port;

// test this vs injecting: https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte
// function connect() {
//   port = browser.runtime.connect({ name: "content-script" });
//   // console.log("connecting");
//   port.onDisconnect.addListener(() => {
//     // console.log("disconnected");
//     // Reconnect when disconnected
//     setTimeout(connect, 100000); // Retry after 100 seconds
//   });
// }

// // Call the connect function to establish the initial connection
// connect();
newVideoLoaded();
