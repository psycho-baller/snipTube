import { useEffect, useState, type FC } from "react";
import Tabs from "./Tabs";
import AllSnips from "./AllSnips";
import "~styles/tailwind.css";

interface Props { }

const Popup: FC<Props> = () => {
  const [count, setCount] = useState<number>(0);
  const [inYoutube, setInYoutube] = useState<boolean>(false);
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

      setInYoutube((url.includes("youtube.com/watch") && currentVideo) ? true : false);
    });
  }, []);

  // const changeBackground = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     const tab = tabs[0];
  //     if (tab.id) {
  //       chrome.tabs.sendMessage(
  //         tab.id,
  //         {
  //           color: "#555555",
  //         },
  //         (msg) => {
  //           console.log("result message:", msg);
  //         }
  //       );
  //     }
  //   });
  // };

  return (

    <main className="w-[30rem] overflow-hidden min-h-max dark:bg-slate-950 dark:text-white">
      {inYoutube ? (
        <Tabs />

      ) : (
        // Have a home page that shows by default when you're not on youtube
        <section className="w-full px-4">
          <AllSnips />
        </section>
      )}
    </main >
  );
};

export default Popup;
