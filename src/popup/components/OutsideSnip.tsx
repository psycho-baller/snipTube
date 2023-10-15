import { useState, type FC } from "react";
import type { Snip } from "~lib/types";
import TimeStamps from "./TimeStamps";
import ActionButtons from "./ActionButtons";
import { useAllSnipsStore, useSnipsStore } from "~stores/sniptube";
import DynamicTextarea from "src/shared/components/DynamicTextarea";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  snip: Snip;
}

const OutsideSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, videoId, note = "" } = snip;

  const [snipComponent, enableAnimations] = useAutoAnimate();

  const snips = useAllSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(note);

  function updateData(note: string): void {
    // setShowDetails((prev) => !prev);
    let vidId: string;
    const newSnips = snips.map((s: Snip) => {
      if (s.id === id) {
        vidId = s.videoId;
        return { ...s, note: note };
      }
      return s;
    }) as Snip[];
    // only update the snips for the video that this snip belongs to
    setSnips(
      // this is the setSnips from useSnipsStore (not useAllSnipsStore)
      newSnips.filter((s: Snip) => s.videoId === vidId),
      vidId
    );
  }

  return (
    <>
      {/* add bg blur to everything except the modal */}
      {/* {showDetails && (
      <div className="blur fixed inset-0 z-50"/>
      // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      //   <div className="relative z-50 w-[30rem] h-[20rem] bg-gray-800 rounded-xl">
      //     <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
      //       <button
      //         className="w-4 h-4 text-white"
      //         onClick={() => setShowDetails(false)}
      //       >
      //         <svg
      //           className="w-full h-full"
      //           viewBox="0 0 256 256"
      //           xmlns="http://www.w3.org/2000/svg"
      //         >
      //           <rect
      //             fill="none"
      //             height="256"
      //             width="256"
      //           />
      //           <line
      //             fill="none"
      //             stroke="currentColor"
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             strokeWidth="20"
      //             x1="216"
      //             x2="40"
      //             y1="40"
      //             y2="216"
      //           />
      //           <line
      //             fill="none"
      //             stroke="currentColor"
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             strokeWidth="20"
      //             x1="216"
      //             x2="40"
      //             y1="216"
      //             y2="40"
      //           />
      //         </svg>
      //       </button>
      //     </div>
      //     <DynamicTextarea
      //       note={textareaValue}
      //       setNote={setTextareaValue}
      //       className="w-full h-full p-2"
      //       defaultHeight={20}
      //       updateData={updateData}
      //       // onKeyDown={stopPropagation}
      //     />
      //   </div>
      // </div>
    )} */}
      <li
        ref={snipComponent}
        className="flex flex-col mb-4 bg-gray-800 rounded-xl"
        onMouseOver={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <div className="flex flex-row">
          <img
            className={`w-1/3 h-[5.25rem] transition-all rounded-l-xl ${showDetails ? "rounded-bl-none" : ""}`}
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="thumbnail"
          />
          <div
            className={
              "flex flex-col justify-between w-full gap-2 px-2 pt-2 overflow-hidden bg-gray-800 rounded-r-xl " +
              (showDetails ? "pb-0" : "pb-2")
            }
          >
            <p
              className={`font-bold text-xs ${
                showDetails ? "" : "whitespace-nowrap overflow-ellipsis overflow-hidden"
              }`}
            >
              {title}
            </p>
            <div className="grid w-full grid-cols-2 gap-2">
              <TimeStamps
                start={startTimestamp}
                end={endTimestamp}
                currentVideoId={videoId}
                id={id}
                tab={1}
              />
              <ActionButtons snip={snip} />
            </div>
          </div>
        </div>
        {/* hidden group-hover/snip:block */}
        {showDetails && (
          <div className="w-full px-3 pb-1.5 pt-3">
            <DynamicTextarea
              note={textareaValue}
              setNote={setTextareaValue}
              className="text-sm px-2 py-1.5"
              defaultHeight={1.5}
              updateData={updateData}
              // onKeyDown={stopPropagation}
            />
          </div>
        )}
      </li>
    </>
  );
};

export default OutsideSnip;
