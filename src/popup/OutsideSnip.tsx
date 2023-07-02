import { useState, type FC, type MouseEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import type { Snip } from '~utils/types';
import TimeStamps from './TimeStamps';
import ActionButtons from './ActionButtons';
import { useAllSnipsStore, useSnipsStore } from '~utils/store';

interface Props {
  snip: Snip;
}

const OutsideSnip: FC<Props> = (props) => {
  const { snip } = props;
  const { id, startTimestamp, endTimestamp, title, videoId, note = '' } = snip;

  const snips = useAllSnipsStore((state) => state.snips);
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
    <li className="flex flex-col mb-4 rounded-xl bg-slate-800">

      <div className="flex flex-row">
        <img className={`w-1/3 h-full transition-all ${showNote ? 'rounded-tl-xl' : 'rounded-l-xl'}`} src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="thumbnail" />
        <div className="flex flex-col justify-between w-full gap-2 p-2 overflow-hidden bg-gray-800 rounded-r-xl">
          <p className="overflow-hidden font-bold whitespace-nowrap overflow-ellipsis">{title}</p>
          <div className="grid w-full grid-cols-2 gap-2">
            <TimeStamps start={startTimestamp} end={endTimestamp} id={id} tab={1} />
            <ActionButtons setShowNote={setShowNote} snip={snip} />
          </div>
        </div>
      </div>
      <div className={`${showNote ? 'block' : 'hidden'} transition-all duration-300 w-full p-3 pb-1.5`}>
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

export default OutsideSnip;
