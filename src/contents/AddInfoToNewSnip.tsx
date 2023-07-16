import { useState, useEffect, type FormEvent, useRef, type KeyboardEvent } from "react";
import { getShowOverlayOnNewSnip } from "~utils/storage";
import { useContentScriptStore } from "~utils/store";
import DynamicTextarea from "./DynamicTextarea";
import type { PlasmoCSConfig } from "plasmo";
import cssText from "data-text:~styles/tailwind.css";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/watch*"],
  // run_at: "document_end",
};
const PlasmoOverlay = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const show = useContentScriptStore((state) => state.showOverlay);

  useEffect(() => {
    new Promise<boolean>((resolve) => {
      getShowOverlayOnNewSnip().then((showOverlayOnNewSnip) => {
        setShowOverlay(showOverlayOnNewSnip);
        resolve(showOverlayOnNewSnip);
      });
    });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const tags = formData.get("tags") as string;
    // remove whitespace and split by comma and remove empty strings
    const tabsArr = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    useContentScriptStore.setState({
      showOverlay: false,
      snipNote: note,
      snipTags: tabsArr,
    });
  };

  const stopPropagation = (e: KeyboardEvent<HTMLElement>) => {
    // prevent from interacting with the video
    e.stopPropagation();
  };

  const [note, setNote] = useState<string>("");

  // TODO: color? put overlay right above the snip in the video? Make sure it's small but also easily expandable to suit a small note and a large note
  return (
    <>
      {showOverlay ? (
        <main className={`flex z-50 items-center justify-center w-screen h-screen ${show ? "block" : "hidden"}`}>
          <form
            className="p-6 m-auto bg-gray-800 w-96 rounded-xl space-y-4 text-white"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-bold mx-aut text-center">New Snip</h1>
            <div className="space-y-1">
              <label
                htmlFor="note"
                className="text-lg text-gray-300"
              >
                Note
              </label>
              <DynamicTextarea
                note={note}
                setNote={setNote}
                onKeyDown={stopPropagation}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-lg text-gray-300"
              >
                Tags (separate tags with commas)
              </label>
              <input
                type="text"
                name="tags"
                id="name"
                onKeyDown={stopPropagation}
                className="px-3 py-2 transition-all border border-gray-600 rounded-md focus:outline-none overflow-x-hidden overflow-y-auto scrollbar scrolling-touch w-full
                dark:bg-gray-700 dark:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-300 placeholder-gray-500
                focus:placeholder-transparent overflow-hidden ease-in-out duration-300 focus:ring-3 focus:ring-gray-600 text-xl"
                placeholder="focus, productivity, ..."
              />
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="px-4 py-2 font-bold bg-gray-700 rounded hover:bg-gray-600 text-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      ) : null}
    </>
  );
};

export default PlasmoOverlay;
