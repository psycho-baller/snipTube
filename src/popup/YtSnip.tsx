import { useState, type FC } from "react";
import TextareaAutosize from "react-textarea-autosize";
import type { Snip, Tag } from "~utils/types";
import { useSnipsStore } from "~utils/store";
import TimeStamps from "./TimeStamps";
import ActionButtons from "./ActionButtons";
interface Props {
  snip: Snip;
}

const YtSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, tags, note = "" } = snip;

  const snips = useSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);

  const [showNote, setShowNote] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(note);

  function updateData(): void {
    setShowNote((prev) => !prev);
    const newSnips = snips.map((s: Snip) => {
      if (s.id === id) {
        return { ...s, notes: textareaValue };
      }
      return s;
    }) as Snip[];
    setSnips(newSnips);
  }

  return (
    <li className="flex flex-col justify-between w-full gap-2 p-3 mb-4 bg-gray-800 shadow-md rounded-xl">
      <p className="text-lg font-medium text-gray-100">{title}</p>
      {/* grid of 3 equal sized columns in 1 row */}
      <div className="grid w-full grid-cols-3 gap-2">
        {/* tags */}
        <div className="flex items-center justify-start col-span-1">
          {/* overflow scroll */}
          {tags?.map((tag: Tag, i: number) => (
            <div
              key={i}
              className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center bg-${
                tag.color ?? "gray"
              }-700`}
            >
              {tag.name}
            </div>
          ))}
        </div>
        <TimeStamps
          inYoutube
          start={startTimestamp}
          end={endTimestamp}
          id={id}
        />
        <ActionButtons
          setShowNote={setShowNote}
          snip={snip}
        />
      </div>

      <div className={`${showNote ? "block" : "hidden"} transition-all duration-300 -mb-1`}>
        <TextareaAutosize
          className="w-full p-2 text-gray-100 placeholder-gray-400 bg-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-gray-800 "
          placeholder="Add a note..."
          value={textareaValue}
          maxRows={5}
          minRows={1}
          onChange={(e) => setTextareaValue(e.target.value)}
          onBlur={updateData}
        />
      </div>
    </li>
  );
};

export default YtSnip;
