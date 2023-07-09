import { useState, type FC, useRef, useEffect, type ChangeEvent } from "react";
import { getDefaultSnipLength, setDefaultSnipLength } from "~utils/storage";
import { useSettingsStore, useSnipsStore } from "~utils/store";

interface Props {
  className?: string;
  stickRight?: boolean;
}

const SettingsButton: FC<Props> = (props) => {
  const { className = "w-5", stickRight } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [length, setLength] = useState<number>(30);

  const handleLengthChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
    await setDefaultSnipLength(parseInt(e.target.value));
  };
  const handleSave = async () => {
    console.log("save", length);
    await setDefaultSnipLength(length);
  };

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    new Promise((resolve) => {
      getDefaultSnipLength().then((length) => {
        console.log("length", length);
        setLength(length);
        resolve(length);
      });
    }) as unknown as number;

    document.addEventListener("click", handleClickOutside);
    return () => {
      // new Promise((resolve) => {
      //   setDefaultSnipLength(length).then(() => {
      //     resolve(length);
      //   });
      // }) as unknown as number;
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="relative flex self-center justify-center"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="flex self-center justify-center p-1 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-gray-600"
      >
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
        >
          <g
            id="SVGRepo_bgCarrier"
            strokeWidth="0"
          ></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M10.5213 3.62368C11.3147 2.75255 12.6853 2.75255 13.4787 3.62368L14.2142 4.43128C14.6151 4.87154 15.1914 5.11025 15.7862 5.08245L16.8774 5.03146C18.0543 4.97645 19.0236 5.94568 18.9685 7.12264L18.9176 8.21377C18.8898 8.80859 19.1285 9.38487 19.5687 9.78582L20.3763 10.5213C21.2475 11.3147 21.2475 12.6853 20.3763 13.4787L19.5687 14.2142C19.1285 14.6151 18.8898 15.1914 18.9176 15.7862L18.9685 16.8774C19.0236 18.0543 18.0543 19.0236 16.8774 18.9685L15.7862 18.9176C15.1914 18.8898 14.6151 19.1285 14.2142 19.5687L13.4787 20.3763C12.6853 21.2475 11.3147 21.2475 10.5213 20.3763L9.78582 19.5687C9.38487 19.1285 8.80859 18.8898 8.21376 18.9176L7.12264 18.9685C5.94568 19.0236 4.97645 18.0543 5.03146 16.8774L5.08245 15.7862C5.11025 15.1914 4.87154 14.6151 4.43128 14.2142L3.62368 13.4787C2.75255 12.6853 2.75255 11.3147 3.62368 10.5213L4.43128 9.78582C4.87154 9.38487 5.11025 8.80859 5.08245 8.21376L5.03146 7.12264C4.97645 5.94568 5.94568 4.97645 7.12264 5.03146L8.21376 5.08245C8.80859 5.11025 9.38487 4.87154 9.78583 4.43128L10.5213 3.62368Z"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
          </g>
        </svg>
      </button>

      <div
        className={
          "absolute top-7 py-2 mt-2 bg-gray-800 rounded-md shadow-lg origin-top duration-200 z-10 max-w-md p-4 mx-auto " +
          (stickRight ? " -right-3" : "") +
          (isOpen ? " scale-100" : " scale-0")
        }
      >
        <div className="flex items-center justify-between mb-4">
          {/* keep in single line:  overflow-ellipsis whitespace-nowrap  */}
          <h2 className="overflow-hidden text-lg font-medium">Settings Form</h2>
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
              {/* Add your question mark icon here */}
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <label
            htmlFor="addNoteAfterSaving"
            className="font-medium"
          >
            Add note after saving snip
          </label>
          <div className="flex items-center mt-2">
            <input
              id="addNoteAfterSaving"
              type="checkbox"
              className="w-5 h-5 text-green-500 form-checkbox"
              // checked={addNoteAfterSaving}
              // onChange={handleAddNoteAfterSavingToggle}
            />
            <label
              htmlFor="addNoteAfterSaving"
              className="ml-2"
            >
              Enable
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="defaultSnipLength"
            className="font-medium"
          >
            Default Snip Length
          </label>
          <div className="flex items-center mt-2">
            <input
              type="number"
              className="w-16 px-2 py-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              value={length}
              onChange={handleLengthChange}
              onBlur={handleSave}
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
    </div>
  );
};

export default SettingsButton;
