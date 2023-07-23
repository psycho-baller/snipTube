import { useState, type FC, useRef, useEffect, type ChangeEvent } from "react";
import {
  getDefaultSnipLength,
  getPauseVideoOnNewSnip,
  getShowOverlayOnNewSnip,
  getUseKeyboardShortcut,
  setDefaultSnipLength,
  setPauseVideoOnNewSnip,
  setShowOverlayOnNewSnip,
  setUseKeyboardShortcut,
} from "src/utils/storage";
interface Props {
  className?: string;
}

const SettingsForm: FC<Props> = (props) => {
  const { className } = props;

  const [showOverlayOnNewSnipState, setShowOverlayOnNewSnipState] = useState<boolean>(true);
  const [pauseVideoOnNewSnipState, setPauseVideoOnNewSnipState] = useState<boolean>(true);
  const [useKeyboardShortcutState, setUseKeyboardShortcutState] = useState<boolean>(true);
  const [length, setLength] = useState<number>(30);

  const handleSave = async () => {
    console.log("save", length);
    await setDefaultSnipLength(length);
  };

  const handleLengthChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
    // await setDefaultSnipLength(parseInt(e.target.value));
  };

  const handleShowOverlayOnNewSnipChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setShowOverlayOnNewSnipState(e.target.checked);
    await setShowOverlayOnNewSnip(e.target.checked);
  };

  const handlePauseVideoOnNewSnipChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setPauseVideoOnNewSnipState(e.target.checked);
    await setPauseVideoOnNewSnip(e.target.checked);
  };

  const handleUseKeyboardShortcutChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUseKeyboardShortcutState(e.target.checked);
    await setUseKeyboardShortcut(e.target.checked);
  };

  useEffect(() => {
    new Promise<number>((resolve) => {
      getDefaultSnipLength().then((length) => {
        console.log("length", length);
        setLength(length);
        resolve(length);
      });
    });

    new Promise<boolean>((resolve) => {
      getShowOverlayOnNewSnip().then((show) => {
        setShowOverlayOnNewSnipState(show);
        resolve(show);
      });
    });

    new Promise<boolean>((resolve) => {
      getPauseVideoOnNewSnip().then((pause) => {
        setPauseVideoOnNewSnipState(pause);
        resolve(pause);
      });
    });

    new Promise<boolean>((resolve) => {
      getUseKeyboardShortcut().then((use) => {
        setUseKeyboardShortcutState(use);
        resolve(use);
      });
    });
  }, []);
  return (
    <section className={className + ""}>
      <div className="flex items-center justify-between">
        {/* keep in single line:  overflow-ellipsis whitespace-nowrap  */}
        <h2 className="-mb-2 overflow-hidden text-2xl font-medium">Settings</h2>
        {/* <button
          type="button"
          className="text-gray-500 bg-transparent hover:text-gray-700"
          aria-label="Add Note After Saving Snip Info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            ?
          </svg>
        </button> */}
      </div>

      <div className="">
        <label
          htmlFor="addNoteAfterSaving"
          className="text-base"
        >
          Create snip with the 's' key
        </label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={useKeyboardShortcutState}
            className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
            onChange={handleUseKeyboardShortcutChange}
          />
          {/* <label
            htmlFor="addNoteAfterSaving"
            className="ml-2"
          >
            Enable
          </label> */}
        </div>
      </div>

      <div className="">
        <label
          htmlFor="addNoteAfterSaving"
          className="text-base"
        >
          Add note after creating snip
        </label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={showOverlayOnNewSnipState}
            className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
            onChange={handleShowOverlayOnNewSnipChange}
          />
          {/* <label
            htmlFor="addNoteAfterSaving"
            className="ml-2"
          >
            Enable
          </label> */}
        </div>
      </div>

      <div className={"" + (showOverlayOnNewSnipState ? " " : " hidden")}>
        <label
          htmlFor="showOverlayOnNewSnip"
          className="text-base"
        >
          Pause video when creating snip
        </label>
        <div className="flex items-center mt-2">
          <input
            checked={pauseVideoOnNewSnipState}
            type="checkbox"
            className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
            onChange={handlePauseVideoOnNewSnipChange}
          />
          {/* <label
            htmlFor="showOverlayOnNewSnip"
            className="ml-2"
          >
            Enable
          </label> */}
        </div>
      </div>

      <div className="">
        <label
          htmlFor="defaultSnipLength"
          className="text-base"
        >
          Default Snip Length
        </label>
        <div className="flex items-center mt-2 !ring-gray-600 hover:ring-2 rounded-lg">
          <input
            type="number"
            className="w-16 form-input border-none !ring-0 rounded-l-lg bg-inherit focus:outline-none"
            value={length}
            onChange={handleLengthChange}
            onBlur={handleSave}
            min={20}
            max={120}
          />
          <input
            type="range"
            className="w-full mr-3 focus:outline-none"
            value={length}
            onChange={handleLengthChange}
            onBlur={handleSave}
            min={20}
            max={120}
          />
        </div>
      </div>
    </section>
  );
};

export default SettingsForm;
