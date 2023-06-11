import { useEffect, useState, type FC } from "react";
import { createRoot } from "react-dom/client";
import type { Snip, Tag } from "~utils/types";
import Tabs from "./Tabs";
import AllSnips from "./AllSnips";
import "~styles/tailwind.css"
import { useAllSnipsStore, useSnipsStore } from "~utils/store";
import { getSnips } from "~utils/storage";

interface Props { }

const Popup: FC<Props> = () => {
  const [count, setCount] = useState<number>(0);
  const [inYoutube, setInYoutube] = useState<boolean>(false);
  const [currentURL, setCurrentURL] = useState<string>();
  const currentVideoSnips: Snip[] = useSnipsStore((state) => state.snips);
  const setCurrentVideoSnips = useSnipsStore((state) => state.setSnips);
  const allVideoSnips: Snip[] = useAllSnipsStore((state) => state.snips);
  const setAllVideoSnips = useAllSnipsStore((state) => state.setSnips);
  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    // clear storage

    // get the current video id
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0] as chrome.tabs.Tab;
      const url = tab.url as string;
      const queryParameters = url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");

      // get all the snips
      getSnips().then((allSnips) => setAllVideoSnips(allSnips));

      if (url.includes("youtube.com/watch") && currentVideo) {
        setInYoutube(true);

        // get the snips for the current video
        getSnips().then((snips) => setCurrentVideoSnips(snips));
      } else {
        setInYoutube(false);
      }
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        setCurrentURL(tabs[0].url);
      });
    });
  }, []);

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
        <Tabs />

      ) : (
        // Have a home page that shows by default when you're not on youtube
        <AllSnips />

        // <div className="text-2xl font-bold text-center uppercase whitespace-nowrap" >🚫not in youtube🚫</div>
      )
      }
    </main >
  );
};

export default Popup;
