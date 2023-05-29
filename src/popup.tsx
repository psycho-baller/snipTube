import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Snip, Tag } from "./types";
import './styles/tailwind.css'
import Tabs from "./components/Tabs";
import AllSnips from "./components/AllSnips";

const Popup = () => {
  const [count, setCount] = useState<number>(0);
  const [inYoutube, setInYoutube] = useState<boolean>(false);
  const [currentURL, setCurrentURL] = useState<string>();
  const [currentVideoSnips, setCurrentVideoSnips] = useState<Snip[]>([]);
  const [allVideoSnips, setAllVideoSnips] = useState<Snip[]>([]);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    // get the current video id
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0] as chrome.tabs.Tab;
      const url = tab.url as string;
      const queryParameters = url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");

      // get all the snips
      chrome.storage.sync.get(null, (obj) => {
        const allSnips = Object.values(obj).flat();
        setAllVideoSnips(allSnips);
      });
      if (url.includes("youtube.com/watch") && currentVideo) {
        setInYoutube(true);

        // get the snips for the current video
        chrome.storage.sync.get([currentVideo], (obj) => {
          setCurrentVideoSnips(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
        });
      } else {
        setInYoutube(false);
      }
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //   setCurrentURL(tabs[0].url);
      // });
    }
    )
  }
    , []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <main className="w-[30rem] min-h-max">
      {inYoutube ? (
        <Tabs currentVideoSnips={currentVideoSnips} allVideoSnips={allVideoSnips} />

      ) : (
        // Have a home page that shows by default when you're not on youtube
        <AllSnips snips={allVideoSnips} />

        // <div className="text-2xl font-bold text-center uppercase whitespace-nowrap" >🚫not in youtube🚫</div>
      )
      }
    </main >
  );
};
{/* <>
  <ul style={{ minWidth: "700px" }}>
    <li>Current URL: {currentURL}</li>
    <li>Current Time: {new Date().toLocaleTimeString()}</li>
  </ul>
  <button
    onClick={() => setCount(count + 1)}
    style={{ marginRight: "5px" }}
  >
    count up
  </button>
  <button onClick={changeBackground}>change background</button>
</> */}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
