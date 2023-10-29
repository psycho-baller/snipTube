import { useEffect, type FC } from "react";
import Tabs from "./components/Tabs";
import AllSnips from "./components/AllSnips";
import "src/styles/tailwind.css";
import { useContentScriptStore } from "~stores/sniptube";
import browser from "webextension-polyfill";
interface Props {}

const Popup: FC<Props> = () => {
  // const [count, setCount] = useState<number>(0);
  // useEffect(() => {
  //   chrome.action.setBadgeText({ text: count.toString() });
  // }, [count]);
  const inYoutube = useContentScriptStore((state) => state.inYoutube);
  const setInYoutube = useContentScriptStore((state) => state.setInYoutube);

  // TODO: this does not run when the popup is first opened, gotta find an alternative way to do this
  useEffect(() => {
    // get the current video id
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      const url = tab.url ?? "";
      const queryParameters = url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");

      setInYoutube(url.includes("youtube.com/watch") && currentVideo ? true : false);

      // temporary fix for dark mode (add a class to the html tag)
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
      }
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
    <div className="w-[30rem] flex flex-col min-h-[30rem] dark:bg-gray-950 dark:text-white">
      {inYoutube ? (
        <Tabs className="flex-grow h-full" />
      ) : (
        // Have a home page that shows by default when you're not on youtube
        <AllSnips className="flex-grow px-4" />
      )}
      <footer className="flex justify-center w-full mb-2 text-sm text-gray-500 dark:text-gray-400 gap-x-1">
        Made with ❤️ by
        <a
          href="https://ramimaalouf.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Rami Maalouf
        </a>
      </footer>
    </div>
  );
};

export default Popup;
