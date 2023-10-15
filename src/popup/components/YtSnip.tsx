import { useState, type FC } from "react";
import type { Snip, Tag } from "~lib/types";
import { useSnipsStore } from "~stores/sniptube";
import TimeStamps from "./TimeStamps";
import ActionButtons from "./ActionButtons";
import DynamicTextarea from "src/shared/components/DynamicTextarea";
import { useAutoAnimate } from "@formkit/auto-animate/react";
interface Props {
  snip: Snip;
}

const YtSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, tags, videoId, note = "" } = snip;

  const [snipComponent, enableAnimations] = useAutoAnimate();

  const snips = useSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(note);

  function updateData(note: string): void {
    // setOpenModal((prev) => !prev);
    const newSnips = snips.map((s: Snip) => {
      if (s.id === id) {
        return { ...s, note: note };
      }
      return s;
    }) as Snip[];
    setSnips(newSnips);
  }

  return (
    <li
      ref={snipComponent}
      className="flex flex-col justify-between w-full gap-2 p-3 mb-4 bg-gray-800 shadow-md rounded-xl group/snip"
      onMouseOver={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <p className="text-lg font-medium text-gray-100">{title}</p>
      {/* grid of 3 equal sized columns in 1 row */}
      <div className="grid w-full grid-cols-3 gap-2">
        {/* tags */}
        <div className="flex items-center justify-start col-span-1 overflow-scroll scrollbar-hidden rounded-full">
          {/* TODO(feat): add tags */}
          {tags?.map((tag: Tag, i: number) => (
            <div
              key={i}
              className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center whitespace-nowrap bg-gray-700`}
              //   tag.color ?? "gray"
              // }-700`}
            >
              {tag.name}
            </div>
          ))}
        </div>
        <TimeStamps
          start={startTimestamp}
          end={endTimestamp}
          currentVideoId={videoId}
          id={id}
        />
        <ActionButtons snip={snip} />
      </div>
      {showDetails && (
        <DynamicTextarea
          note={textareaValue}
          setNote={setTextareaValue}
          className="text-base py-1.5 px-2"
          defaultHeight={1.7}
          updateData={updateData}
          // onKeyDown={stopPropagation}
        />
      )}
    </li>
  );
};

export default YtSnip;
