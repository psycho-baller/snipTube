import type { Snip, VidDetails } from "./utils/types";
import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from "plasmo";
import {
  getDefaultSnipLength,
  getPauseVideoOnNewSnip,
  getShowOverlayOnNewSnip,
  getSnips,
  setDefaultSnipLength,
  setSnips,
} from "~utils/storage";
import { getVideoDetails, getFullSummary } from "~utils/youtube";
import { getSnipTranscript } from "~utils/youtube";
import { URL } from "~utils/constants";
import { createRoot } from "react-dom/client";
import { useState, type FormEvent, type KeyboardEvent, useEffect } from "react";
import { useSettingsStore, useContentScriptStore } from "~utils/store";
export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/watch*"],
  // run_at: "document_end",
};
let videoId = "";
let videoIdSnips = [] as Snip[];
let youtubePlayer: HTMLVideoElement;
let firstRightButton: HTMLButtonElement;
let previewBar: HTMLUListElement;
let vidTranscript: string;
let vidSummary: string;
let vidTitle: string;
let note: string = "";
// ask user for note and tags
const PlasmoOverlay = () => {
  if (getShowOverlayOnNewSnip()) {
    return null;
  }

  const show = useContentScriptStore((state) => state.showOverlay);
  // const [pauseVideoOnNewSnip, setPauseVideoOnNewSnip] = useState<boolean>(true);

  // useEffect(() => {
  //   new Promise<boolean>((resolve) => {
  //     getPauseVideoOnNewSnip().then((pauseVideoOnNewSnip) => {
  //       console.log("pauseVideoOnNewSnip", pauseVideoOnNewSnip);
  //       setPauseVideoOnNewSnip(pauseVideoOnNewSnip);
  //       resolve(pauseVideoOnNewSnip);
  //     });
  //   });
  // }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const note = formData.get("note") as string;
    const tags = formData.get("tags") as string;
    const tabsArr = tags.split(",").map((tag) => tag.trim());
    useContentScriptStore.setState({
      showOverlay: false,
      snipNote: note,
      snipTags: tabsArr,
    });
  };

  const stopPropagation = (e: KeyboardEvent<HTMLInputElement>) => {
    // prevent from interacting with the video
    e.stopPropagation();
  };

  // TODO: color? put overlay right above the snip in the video? Make sure it's small but also easily expandable to suit a small note and a large note
  return (
    <main
      className={`flex items-center justify-center w-screen h-screen ${show ? "block" : "hidden"}`}
    >
      <form
        className="p-6 m-auto bg-gray-800 w-96 rounded-xl"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="note"
          className="block mb-2 text-gray-100"
        >
          Note
        </label>
        <input
          type="text"
          name="note"
          id="note"
          className="w-full px-4 py-2 mb-4 border border-gray-700 rounded-lg"
          onKeyDown={stopPropagation}
        />
        <label
          htmlFor="tags"
          className="block mb-2 text-gray-100"
        >
          Tags
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          className="w-full px-4 py-2 mb-4 border border-gray-700 rounded-lg"
          onKeyDown={stopPropagation}
        />
        <button
          type="submit"
          className="px-4 py-2 font-bold text-gray-100 bg-gray-800 rounded hover:bg-gray-700"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

const newVideoLoaded = async () => {
  // const len = await getDefaultSnipLength();
  // useSettingsStore.setState({ defaultLength: len });
  // console.log(useSettingsStore.getState().defaultLength, "meow", len);
  const snipButtonExists = document.getElementsByClassName("snip-btn")[0];
  chrome.storage.sync.clear();

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
  await chrome.storage.sync.set({ videoId });

  // section 1: add a snip button
  if (!snipButtonExists) {
    // create an svg element
    const snipBtn = document.createElement("button");
    snipBtn.innerHTML = `<svg style="padding: 2px; padding-bottom: 4px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Plus_Circle"> <path id="Vector" d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>`;

    snipBtn.className = "snip-btn" + " ytp-button";
    snipBtn.title = "Create a snip";
    snipBtn.style.display = "inline-flex";
    snipBtn.style.alignItems = "center";
    snipBtn.style.justifyContent = "center";

    // get the first button in the right side of the video
    firstRightButton = document
      .getElementsByClassName("ytp-right-controls")[0]
      ?.getElementsByClassName("ytp-button")[0] as HTMLButtonElement;
    youtubePlayer = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;

    // add it before the first button
    firstRightButton?.parentElement?.insertBefore(snipBtn, firstRightButton);
    snipBtn.addEventListener("click", addNewSnipEventHandler);
  }

  // section 2: add the snips to the video
  await updateVideoSnips();

  const { transcript, title } = (await getVideoDetails(videoId)) as VidDetails;
  vidTranscript = transcript.map((d) => d.text).join(" ");
  vidTitle = title;

  vidSummary = await getFullSummary(vidTranscript, vidTitle, videoId);
};

async function addNewSnipEventHandler() {
  // TODO: figure out how I want the process to work

  const date = new Date();
  const currentTime = ~~youtubePlayer.currentTime; // ~~ is a faster Math.floor
  const startTime = currentTime - (await getDefaultSnipLength());
  const snipTranscript = getSnipTranscript(videoId, startTime, currentTime);
  if (!snipTranscript) {
    return;
  }

  const encodedTranscript = Buffer.from(snipTranscript).toString("base64");
  // remove things that don't work with base64 encoding like emojis
  const cleanedTitle = vidTitle.replace(/[\uD800-\uDFFF]./g, "");
  const encodedTitle = Buffer.from(cleanedTitle).toString("base64");
  const encodedSummary = Buffer.from(vidSummary).toString("base64");
  let summary = "";

  // show the overlay and wait for the user to add details
  const { snipNote, snipTags } = await new Promise<{ snipNote: string; snipTags: string[] }>(
    async (resolve) => {
      // if user doesn't want to add details after snipping, resolve with empty strings
      if (!(await getShowOverlayOnNewSnip())) {
        summary = await fetch(`${URL}/llm/summarize/snip`, {
          // mode: "no-cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: encodedTranscript,
            title: encodedTitle,
            summary: encodedSummary,
          }),
        })
          .then((response) => response.json())
          .then((data) => data.summary);
        resolve({
          snipNote: "",
          snipTags: [],
        });
      } else {
        // otherwise, show the overlay and wait for the user to add details
        useContentScriptStore.setState({ showOverlay: true });
        // check if user wants to pause video on new snip
        if (await getPauseVideoOnNewSnip()) {
          youtubePlayer.pause();
        }

        useContentScriptStore.subscribe(async (showOverlay) => {
          resolve({
            snipNote: useContentScriptStore.getState().snipNote,
            snipTags: useContentScriptStore.getState().snipTags,
          });
          // unpause the video if it was paused
          if (await getPauseVideoOnNewSnip()) {
            youtubePlayer.play();
          }
        });
        summary = await fetch(`${URL}/llm/summarize/snip`, {
          // mode: "no-cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: encodedTranscript,
            title: encodedTitle,
            summary: encodedSummary,
          }),
        })
          .then((response) => response.json())
          .then((data) => data.summary);
      }
    }
  );

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
    videoId: videoId,
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
  };
  // chrome.storage.sync.set({
  //   [videoId]: JSON.stringify([...videoIdSnips, newSnip].sort((a, b) => a.endTimestamp - b.endTimestamp))
  // });
  getSnips().then((snips) =>
    setSnips(
      [...snips, newSnip].sort((a, b) => a.endTimestamp - b.endTimestamp),
      videoId
    ).then((newSnips) => updateVideoSnips(newSnips))
  );
}

async function updateVideoSnips(snips?: Snip[]) {
  // console.log("videoId", videoId);

  // videoIdSnips = await getSnips() as Snip[];
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
    // if (document.getElementById(`snip-${ id }`)) {
    //   return;
    // }
    const snipElement = document.createElement("li");
    const firstTag = tags && tags.length > 0 ? tags[0] : undefined;
    snipElement.id = `snip-${id}} `;
    snipElement.style.position = "absolute";
    snipElement.style.top = "0px";
    snipElement.style.left = `${(startTimestamp / youtubePlayer.duration) * 100}% `;
    snipElement.style.width = `${
      ((endTimestamp - startTimestamp) / youtubePlayer.duration) * 100
    }% `;
    snipElement.style.height = "100%";
    snipElement.style.backgroundColor = firstTag?.color || "yellow";
    snipElement.style.zIndex = "1000";
    snipElement.style.cursor = "pointer";
    snipElement.title = "Click to jump to this snip";

    // snipElement.addEventListener("click", () => {
    //   youtubePlayer.currentTime = startTimestamp;
    // });
    previewBar?.appendChild(snipElement);
  });
  // if
}

chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
  const { type, value, vidId } = obj;

  if (type === "NEW") {
    videoId = vidId;
    await newVideoLoaded();
  } else if (type === "PLAY_SNIP") {
    youtubePlayer.currentTime = value;
  } else if (type === "DELETE") {
    videoIdSnips = videoIdSnips.filter((b) => b.endTimestamp != value);
    // chrome.storage.sync.set({ [videoId]: JSON.stringify(videoIdSnips) });

    response(videoIdSnips);
  }

  await newVideoLoaded();
});

import cssText from "data-text:~styles/tailwind.css";
export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};
export default PlasmoOverlay;
