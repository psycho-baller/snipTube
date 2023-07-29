import { useState, useEffect, type FormEvent, type KeyboardEvent, type ChangeEvent } from "react";
import { getDefaultSnipLength, getShowOverlayOnNewSnip } from "src/utils/storage";
import { useContentScriptStore } from "src/utils/store";
import DynamicTextarea from "../shared/components/DynamicTextarea";
import type { PlasmoCSConfig } from "plasmo";
import cssText from "data-text:src/styles/tailwind.css";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: [
    "https://youtube.com/watch*",
    "https://www.youtube.com/watch*",
    "https://youtu.be/watch*",
    "https://www.youtu.be/watch*",
    "https://www.youtube-nocookie.com/watch*",
    "https://youtube-nocookie.com/watch*",
    "https://www.youtube.com/embed/watch*",
    "https://youtube.com/embed/watch*",
  ],
  // run_at: "document_end",
};
const PlasmoOverlay = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [note, setNote] = useState<string>("");

  // const defaultLength = useSettingsStore((state) => state.defaultLength);
  const [snipLength, setSnipLength] = useState<number>(30);
  // const snipLength = defaultLength;
  // const setSnipLength = useContentScriptStore((state) => state.setSnipLength);
  const show = useContentScriptStore((state) => state.showOverlay);

  useEffect(() => {
    new Promise<void>((resolve) => {
      getShowOverlayOnNewSnip().then((showOverlayOnNewSnip) => {
        setShowOverlay(showOverlayOnNewSnip);
        resolve();
      });
    });

    // TODO: for some reason it doesn't the most up to date value (gotta refresh the page)
    new Promise<void>((resolve) => {
      getDefaultSnipLength().then((defaultLength) => {
        setSnipLength(defaultLength);
        resolve();
      });
    });
  }, []);

  const cancelRequest = () => {
    useContentScriptStore.setState({ showOverlay: false, cancelSnipRequest: true });
  };

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
      snipLength,
    });
  };

  const stopPropagation = (e: KeyboardEvent<HTMLElement>) => {
    // prevent from interacting with the video
    e.stopPropagation();
  };

  const handleLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const length = parseInt(e.target.value);
    setSnipLength(length);
  };

  // TODO: color? put overlay right above the snip in the video? Make sure it's small but also easily expandable to suit a small note and a large note
  return (
    <>
      {showOverlay ? (
        <main className={`flex z-50 items-center justify-center w-screen h-screen ${show ? "block" : "hidden"}`}>
          <form
            className="p-6 m-auto space-y-4 text-white bg-gray-800 w-96 rounded-xl"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-bold text-center mx-aut">New Snip</h1>
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
                className="px-3 py-2 text-xl"
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
                className="w-full px-3 py-2 overflow-hidden overflow-x-hidden overflow-y-auto scrolling-touch text-xl placeholder-gray-500 transition-all duration-300 ease-in-out border border-gray-600 rounded-md focus:outline-none scrollbar dark:bg-gray-700 dark:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-300 focus:placeholder-transparent focus:ring-3 focus:ring-gray-600"
                placeholder="focus, productivity, ..."
              />
            </div>
            <div className="">
              <label
                htmlFor="defaultSnipLength"
                className="text-lg text-gray-300"
              >
                Default Snip Length
              </label>
              <div className="flex items-center mt-2 !ring-gray-600 hover:ring-2 rounded-lg">
                <input
                  type="number"
                  className="w-24 form-input text-xl border-none !ring-0 rounded-l-lg bg-inherit focus:outline-none"
                  value={snipLength}
                  onChange={handleLengthChange}
                  onKeyDown={stopPropagation}
                  // onBlur={handleSave}
                  min={20}
                  max={120}
                />
                <input
                  type="range"
                  className="w-full mr-3 focus:outline-none"
                  value={snipLength}
                  onChange={handleLengthChange}
                  // onBlur={handleLengthChange}
                  min={20}
                  max={120}
                />
              </div>
            </div>
            <div className="flex justify-between pt-2">
              {/* close button */}
              <button
                type="button"
                className="px-4 py-2 text-lg font-medium transition-colors border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                onClick={cancelRequest}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-lg font-bold transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
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
