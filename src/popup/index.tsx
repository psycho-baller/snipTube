import { useEffect, useState, type FC } from "react";
import Tabs from "./Tabs";
import AllSnips from "./AllSnips";
import "src/styles/tailwind.css";
import { useContentScriptStore } from "src/utils/store";

interface Props {}

const Popup: FC<Props> = () => {
  const [count, setCount] = useState<number>(0);
  const inYoutube = useContentScriptStore((state) => state.inYoutube);
  const setInYoutube = useContentScriptStore((state) => state.setInYoutube);
  // useEffect(() => {
  //   chrome.action.setBadgeText({ text: count.toString() });
  // }, [count]);

  useEffect(() => {
    // get the current video id
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0] as chrome.tabs.Tab;
      const url = tab.url as string;
      const queryParameters = url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");

      setInYoutube(url.includes("youtube.com/watch") && currentVideo ? true : false);
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
    <div className="w-[30rem] flex flex-col min-h-[29.8rem] dark:bg-gray-950 dark:text-white">
      {inYoutube ? (
        <Tabs className="flex-grow h-full" />
      ) : (
        // Have a home page that shows by default when you're not on youtube
        <AllSnips className="flex-grow px-4" />
      )}
      <footer className="flex justify-center w-full mb-2 text-sm text-gray-500 dark:text-gray-400 gap-x-1">
        {/* Made with ❤️ by */}
        <a
          href="https://github.com/psycho-baller/sniptube"
          target="_blank"
          rel="noopener noreferrer"
          className="transition font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-red-300"
        >
          Support
        </a>{" "}
        this project
      </footer>
    </div>
  );
};

export default Popup;
