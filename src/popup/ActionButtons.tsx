import { type FC, type MouseEvent, type Dispatch, type SetStateAction } from "react";
import { useSnipsStore } from "~stores/sniptube";
import type { Snip } from "~lib/types";
import ExportButton from "./ExportButton";

interface Props {
  snip: Snip;
  width?: string;
}

const ActionButtons: FC<Props> = (props) => {
  const { snip, width = "w-5" } = props;
  const { id } = snip;

  const removeSnip = useSnipsStore((state) => state.removeSnip);

  function deleteSnip(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    removeSnip(id);
  }

  return (
    <div className="flex items-center justify-end col-span-1 gap-2">
      <ExportButton
        snip={snip}
        className={width}
      />

      {/* <button
        className="relative flex justify-center p-1 bg-gray-700 rounded-full group"
        onClick={editSnip}
      >
        <svg
          className={width}
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            fill="none"
            height="256"
            width="256"
          />
          <polygon
            fill="none"
            points="128 160 96 160 96 128 192 32 224 64 128 160"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="20"
          />
          <line
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="20"
            x1="164"
            x2="196"
            y1="60"
            y2="92"
          />
          <path
            d="M216,128.6V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h79.4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="20"
          />
        </svg>
        <span className="absolute z-50 w-auto p-1 text-xs text-gray-800 capitalize transition-all duration-100 origin-bottom scale-0 bg-white rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 tooltip min-w-max bottom-7 group-hover:delay-300 group-hover:scale-100">
          Edit note
        </span>
      </button> */}

      {/* <button className="relative flex justify-center p-1 bg-gray-700 rounded-full group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={width}
          viewBox="0 0 26 24"
        >
          <path
            fill="none"
            d="M0 0h24v24H0V0z"
          ></path>
          <path
            fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
          ></path>
        </svg>
        <span className="absolute z-50 w-auto p-1 text-xs text-gray-800 capitalize transition-all duration-100 origin-bottom scale-0 bg-white rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 tooltip min-w-max bottom-7 group-hover:delay-300 group-hover:scale-100">
          Share snip
        </span>
      </button> */}

      <button
        className="relative flex justify-center p-1 bg-gray-700 rounded-full group"
        onClick={deleteSnip}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${width} text-red-500`}
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
          ></path>
        </svg>
        <span className="absolute z-50 w-auto p-1 text-xs text-gray-800 capitalize transition-all duration-100 origin-bottom scale-0 bg-white rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 tooltip min-w-max bottom-7 group-hover:delay-300 group-hover:scale-100">
          Delete Snip
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;
