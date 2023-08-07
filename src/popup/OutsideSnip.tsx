import { useState, type FC } from "react";
import type { Snip } from "src/utils/types";
import TimeStamps from "./TimeStamps";
import ActionButtons from "./ActionButtons";
import { useAllSnipsStore, useSnipsStore } from "src/utils/store";
import DynamicTextarea from "src/shared/components/DynamicTextarea";

interface Props {
  snip: Snip;
}

const OutsideSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, videoId, note = "" } = snip;

  const snips = useAllSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);
  // no longer used (for now)
  const [showNote, setShowNote] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(note);

  function updateData(note: string): void {
    // setShowNote((prev) => !prev);
    let vidId: string;
    const newSnips = snips.map((s: Snip) => {
      if (s.id === id) {
        vidId = s.videoId;
        return { ...s, note: note };
      }
      return s;
    }) as Snip[];
    console.log("vidId test:", vidId);
    // only update the snips for the video that this snip belongs to
    setSnips(
      // this is the setSnips from useSnipsStore (not useAllSnipsStore)
      newSnips.filter((s: Snip) => s.videoId === vidId),
      vidId
    );
  }

  return (
    <li className="flex flex-col mb-4 bg-gray-800 rounded-xl group/snip">
      <div className="flex flex-row">
        <img
          className={`w-1/3 h-full transition-all rounded-l-xl group-hover/snip:rounded-bl-none`}
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="thumbnail"
        />
        <div className="flex flex-col justify-between w-full gap-2 p-2 overflow-hidden bg-gray-800 rounded-r-xl">
          <p className="overflow-hidden font-bold whitespace-nowrap overflow-ellipsis">{title}</p>
          <div className="grid w-full grid-cols-2 gap-2">
            <TimeStamps
              start={startTimestamp}
              end={endTimestamp}
              currentVideoId={videoId}
              id={id}
              tab={1}
            />
            <ActionButtons
              setShowNote={setShowNote}
              snip={snip}
            />
          </div>
        </div>
      </div>
      <div className={`hidden group-hover/snip:block transition-all duration-300 w-full p-3 pb-1.5`}>
        <DynamicTextarea
          note={textareaValue}
          setNote={setTextareaValue}
          className="text-sm px-2 py-1.5"
          defaultHeight={1.5}
          updateData={updateData}
          // onKeyDown={stopPropagation}
        />
      </div>
    </li>
  );
};

export default OutsideSnip;
