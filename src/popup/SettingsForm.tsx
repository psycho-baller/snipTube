import { useState, type FC, useRef, useEffect, type ChangeEvent } from "react";
import {
  getDefaultSnipLength,
  getPauseVideoOnNewSnip,
  getShowOverlayOnNewSnip,
  setDefaultSnipLength,
} from "~utils/storage";
interface Props {
  className?: string;
}

const SettingsForm: FC<Props> = (props) => {
  const { className } = props;

  const [showOverlayOnNewSnip, setShowOverlayOnNewSnip] = useState<boolean>(false);
  const [pauseVideoOnNewSnip, setPauseVideoOnNewSnip] = useState<boolean>(false);
  const [length, setLength] = useState<number>(30);

  const handleSave = async () => {
    console.log("save", length);
    await setDefaultSnipLength(length);
  };

  const handleLengthChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
    await setDefaultSnipLength(parseInt(e.target.value));
  };

  const handleShowOverlayOnNewSnipChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowOverlayOnNewSnip(e.target.checked);
    console.log("showOverlayOnNewSnip", e.target.checked);
    setShowOverlayOnNewSnip(e.target.checked);
  };

  const handlePauseVideoOnNewSnipChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setPauseVideoOnNewSnip(e.target.checked);
    await setPauseVideoOnNewSnip(e.target.checked);
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
      getShowOverlayOnNewSnip().then((showOverlayOnNewSnip) => {
        console.log("showOverlayOnNewSnip", showOverlayOnNewSnip);
        setShowOverlayOnNewSnip(showOverlayOnNewSnip);
        resolve(showOverlayOnNewSnip);
      });
    });

    new Promise<boolean>((resolve) => {
      getPauseVideoOnNewSnip().then((pauseVideoOnNewSnip) => {
        console.log("pauseVideoOnNewSnip", pauseVideoOnNewSnip);
        setPauseVideoOnNewSnip(pauseVideoOnNewSnip);
        resolve(pauseVideoOnNewSnip);
      });
    });
  }, []);
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {/* keep in single line:  overflow-ellipsis whitespace-nowrap  */}
        <h2 className="-mb-2 overflow-hidden text-2xl font-medium">Settings</h2>
        <button
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
        </button>
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
            checked={showOverlayOnNewSnip}
            className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
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

      <div className={"" + (showOverlayOnNewSnip ? " " : " hidden")}>
        <label
          htmlFor="showOverlayOnNewSnip"
          className="text-base"
        >
          Pause video when creating snip
        </label>
        <div className="flex items-center mt-2">
          <input
            checked={pauseVideoOnNewSnip}
            type="checkbox"
            className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
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
        <div className="flex items-center mt-2">
          <input
            type="number"
            className="w-16 px-2 py-1 text-gray-300 bg-gray-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 focus:bg-gray-800"
            value={length}
            onChange={handleLengthChange}
            // onBlur={handleSave}
            min={20}
            max={100}
          />
          <button
            type="button"
            className="text-gray-500 bg-transparent hover:text-gray-700"
            aria-label="Default Snip Length Info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {/* Add your question mark icon here */}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
