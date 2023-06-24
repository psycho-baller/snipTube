
import { useState, type FC, type MouseEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import type { Snip, Tag } from '~utils/types';
import { useSnipsStore } from '~utils/store';
import TimeStamps from './TimeStamps';
import ActionButtons from './ActionButtons';
interface Props {
  snip: Snip;
}

const YtSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, tags, notes = '' } = snip;

  const snips = useSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(notes);

  const removeSnip = useSnipsStore((state) => state.removeSnip);

  function deleteSnip(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    removeSnip(id);
  }

  function editSnip(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setShowNote((prev) => !prev);
  }

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
      <div className="overflow-hidden font-bold text-slate-100 overflow-ellipsis whitespace-nowrap">{title}</div>
      {/* grid of 3 equal sized columns in 1 row */}
      <div className="grid w-full grid-cols-3 gap-2">
        {/* tags */}
        <div className="flex items-center justify-start col-span-1">
          {/* overflow scroll */}
          {tags?.map((tag: Tag, i: number) => (
            <div key={i} className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center bg-${tag.color ?? "slate"}-600`}>{tag.name}</div>
          ))}
        </div>
        <TimeStamps start={startTimestamp} end={endTimestamp} id={id} />
        <ActionButtons deleteSnip={deleteSnip} editSnip={editSnip} />
      </div>

      <div className={`${showNote ? 'block' : 'hidden'} transition-all duration-300 -mb-1`}>
        <TextareaAutosize
          className="w-full p-2 rounded-md resize-none text-slate-100 bg-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:bg-slate-800 placeholder-slate-400 "
          placeholder="Add a note..."
          value={textareaValue}
          maxRows={5}
          minRows={1}
          onChange={e => setTextareaValue(e.target.value)}
          onBlur={updateData}
        />
      </div>
    </li>
  );
};

export default YtSnip;
