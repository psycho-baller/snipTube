import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Snip, Tag } from "./types";
import './styles/tailwind.css'

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
    <main className="w-96 min-h-max p-4">
      {inYoutube ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Current Video Bookmarks</h1>
          <ul>
            {currentVideoBookmarks.map((bookmark: Snip, i): JSX.Element => (
              <li key={i} className="mb-4 border border-gray-300 rounded-md flex flex-row">
                <img className="h-full" src="https://i.ytimg.com/vi/3qYbVjg5Z7k/hqdefault.jpg" alt="thumbnail" />
                <div className="flex flex-col justify-start w-full p-4">
                  {bookmark?.title && (
                    <div className="font-bold">{bookmark?.title}</div>
                  )}
                  <div className="flex flex-row justify-between">
                    <div className="text-gray-500">{Math.floor(bookmark.startTimestamp / 60)}:{String(Math.round(bookmark.startTimestamp) % 60).padStart(2, "0")}</div>
                    <div className="text-gray-500">{Math.floor(bookmark.endTimestamp / 60)}:{String(Math.round(bookmark.endTimestamp) % 60).padStart(2, "0")}</div>

                  </div>
                </div>
                {/* <div className="flex">
                    {bookmark?.tags?.map((tag: Tag, i: number) => (
                      <div key={i} className={`bg-${tag.color ?? "gray"}-300 rounded-full px-2 py-1 text-xs mr-2 border border-${tag.color ?? "gray"}-400`}>{tag.name}</div>
                    ))}
                  </div> */}
                {/* <div className="mt-2">{bookmark?.notes ?? ""}</div> */}
              </li>
            ))}
          </ul>
        </>
      ) : (
        // Have a home page that shows by default when you're not on youtube
        <div className="uppercase text-center text-2xl font-bold whitespace-nowrap" >🚫not in youtube🚫</div>
      )
      }
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
