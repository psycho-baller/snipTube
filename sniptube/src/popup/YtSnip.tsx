
import { useState, type FC, type MouseEvent, useEffect, type FocusEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import type { Snip, Tag } from '~utils/types';
import "~styles/play-pause-btn.css";
import { useSnipsStore } from '~utils/store';
interface Props {
  snip: Snip;
  index: number;
}

const YtSnip: FC<Props> = (props) => {
  const { snip, index } = props;

  const snips = useSnipsStore((state) => state.snips);
  const setSnips = useSnipsStore((state) => state.setSnips);
  const [state, setState] = useState<'pause' | 'play'>('pause')
  const [showNote, setShowNote] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(snip?.notes ?? '');

  const removeSnip = useSnipsStore((state) => state.removeSnip);
  let animateElement: SVGAnimateElement;


  useEffect(() => {
    animateElement = document.getElementById('from_play_to_pause_' + index) as unknown as SVGAnimateElement;
    animateElement.beginElement();
  }, [])

  const handlePlayBtnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // animate the play button
    if (state === 'pause') {
      setState('play');
      animateElement = document.getElementById('from_pause_to_play_' + index) as unknown as SVGAnimateElement;
      animateElement.beginElement();
    } else {
      setState('pause');
      animateElement = document.getElementById('from_play_to_pause_' + index) as unknown as SVGAnimateElement;
      animateElement.beginElement();
    }

    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const tab = tabs[0];
    //   if (tab.id) {
    //     chrome.tabs.sendMessage(
    //       tab.id,
    //       {
    //         type: "PLAY_SNIP",
    //         payload: snip,
    //       },
    //       (response) => {
    //         console.log(response);
    //       }
    //     );
    //   }
    // }
    // );
  };

  function deleteSnip(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    // const newSnips = snips.filter((s: Snip) => s.id !== snip.id) as Snip[];
    // setSnips(newSnips);
    removeSnip(snip.id);
    // chrome.storage.sync.get([vidID], (result) => {
    //   const snips = JSON.parse(result[vidID]);
    //   const newSnips = snips.filter((s: Snip) => s.id !== snip.id) as Snip[];
    //   chrome.storage.sync.set({ [vidID]: JSON.stringify(newSnips) as string } as { [key: string]: string }, () => {
    //     console.log("snip deleted");
    //   }) as void;

    //   // update the snips
    //   // updateVideoSnips();

    // });
  }

  function editSnip(e: MouseEvent<HTMLButtonElement>): void {
    setShowNote((prev) => !prev);
    e.preventDefault();
  }

  function updateData(): void {
    setShowNote((prev) => !prev);
    const newSnips = snips.map((s: Snip) => {
      if (s.id === snip.id) {
        return { ...s, notes: textareaValue };
      }
      return s;
    }) as Snip[];
    setSnips(newSnips);
  }

  return (
    <li className="flex flex-col justify-start w-full gap-1 p-3 mb-4 bg-gray-800 shadow-md rounded-3xl">
      <div className="font-bold">{snip.title}</div>
      {/* grid of 3 equal sized columns in 1 row */}
      <div className="grid w-full grid-cols-3 gap-2">
        {/* tags */}
        <div className="flex items-center justify-start col-span-1">
          {/* overflow scroll */}
          {snip.tags?.map((tag: Tag, i: number) => (
            <div key={i} className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center bg-${tag?.color ?? "slate"}-600`}>{tag.name}</div>
          ))}
        </div>
        {/* timestamps */}
        <div className="flex items-center justify-center col-span-1 text-slate-400">
          <div className="">{Math.floor(snip.startTimestamp / 60)}:{String(Math.round(snip.startTimestamp) % 60).padStart(2, "0")}</div>
          {/* <div className="mx-1">-</div> */}
          {/* play button */}
          <button className="flex items-center m-auto transform rounded-full" onClick={handlePlayBtnClick} id='pause'  >
            <svg width="30" height="30" id={index.toString()} viewBox="0 0 104 04" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle id="circle" className={`${state === 'play' ? 'play' : ''}`} cx="51" cy="1" r="50" strokeDasharray="314" strokeDashoffset="0" />
              <line id='line1' x1="38" y1="-20" x2="38" y2="20" />
              <path className='line2' id={`line2_${index}`} d="M 66 -20 L 66 0 L 66 20" rx="10" ry="10">
                <animate
                  attributeName="d"
                  dur="300ms"
                  from="M 66 -20 L 66 0 L 66 20"
                  to="M 38 -20 L 70 0 L 38 20"
                  begin="indefinite"
                  fill="freeze"
                  id={`from_play_to_pause_${index}`}
                />
              </path>
              <animate
                xlinkHref={`#line2_${index}`}
                attributeName="d"
                dur="300ms"
                from="M 38 -20 L 70 0 L 38 20"
                to="M 66 -20 L 66 0 L 66 20"
                fill="freeze"
                id={`from_pause_to_play_${index}`}
                begin="indefinite"
              />

            </svg>
          </button>
          <div className="">{Math.floor(snip.endTimestamp / 60)}:{String(Math.round(snip.endTimestamp) % 60).padStart(2, "0")}</div>
        </div>
        {/* buttons */}
        <div className="flex items-center justify-end col-span-1 gap-2">
          <button className="p-1 rounded-full bg-slate-600" onClick={editSnip}>
            <svg className='w-6 text-slate-100' width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <rect fill="none" height="256" width="256" />
              <polygon fill="none" points="128 160 96 160 96 128 192 32 224 64 128 160" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
              <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="164" x2="196" y1="60" y2="92" />
              <path d="M216,128.6V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h79.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
            </svg>
          </button>
          <button className="p-1 rounded-full bg-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 text-slate-100 " viewBox="0 0 26 24"><path fill="none" d="M0 0h24v24H0V0z"></path><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path></svg>
          </button>
          <button className="p-1 rounded-full bg-slate-600" onClick={deleteSnip}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 text-red-500 " viewBox="0 0 32 32"><path fill="currentColor"
              d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"></path></svg>
          </button>
        </div>
      </div>
      {/* notes */}
      <div className={`${showNote ? 'block' : 'hidden'} transition-all duration-300 mt-2`}>
        <TextareaAutosize
          // textarea not expandable
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
