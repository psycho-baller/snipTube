import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Snip } from "./types";
const Popup = () => {
  const [count, setCount] = useState(0);
  const [inYoutube, setInYoutube] = useState(false);
  const [currentURL, setCurrentURL] = useState<string>();
  const [currentVideoBookmarks, setCurrentVideoBookmarks] = useState<Snip[]>([]);

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

      if (url.includes("youtube.com/watch") && currentVideo) {
        setInYoutube(true);
        chrome.storage.sync.get([currentVideo], (obj) => {
          setCurrentVideoBookmarks(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
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
    <main>
      {inYoutube ? (
        <ul>
          <h1>Current Video Bookmarks</h1>
          {currentVideoBookmarks.map((b) => (
            <li key={b.id}>
              {b.startTimestamp} - {b.endTimestamp}
            </li>
          ))}
        </ul>
      ) : (
        <div>not in youtube</div>
      )}
    </main>
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
