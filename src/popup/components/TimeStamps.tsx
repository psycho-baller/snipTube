import { useState, type FC, useEffect, type MouseEvent } from "react";
import "src/styles/play-pause-btn.css";
import { getVideoId } from "~lib/storage";
import { useContentScriptStore } from "~stores/sniptube";

interface Props {
  start: number;
  end: number;
  currentVideoId: string;
  id: string;
  tab?: number;
}

const TimeStamps: FC<Props> = (props) => {
  const { start, end, currentVideoId, id, tab = 0 } = props;
  let animateElement: SVGAnimateElement;

  const [state, setState] = useState<"pause" | "play">("play");
  const inYoutube = useContentScriptStore((state) => state.inYoutube);

  useEffect(() => {
    animateElement = document.getElementById("from_play_to_pause_" + id + tab) as unknown as SVGAnimateElement;
    animateElement.beginElement();
  }, []);

  const handlePlayBtnClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const storedVideoId = await getVideoId();

    if (inYoutube && currentVideoId === storedVideoId) {
      // send message to content script to play the snip
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab.id) {
        await browser.tabs.sendMessage(tab.id, {
          type: "PLAY_SNIP",
          value: start,
        });
      }
    } else {
      // TODO: play the video/audio in the popup itself (thumbnail becomes the video player)
      // for now open a new tab with the youtube video
      await browser.tabs.create({ url: `https://www.youtube.com/watch?v=${id}&t=${start}` });
    }
  };

  return (
    <div className="flex items-center justify-center col-span-1 gap-2 text-gray-400">
      <div className="">
        {Math.floor(start / 60)}:{String(Math.round(start) % 60).padStart(2, "0")}
      </div>
      {/* <div className="mx-1">-</div> */}
      {/* play button */}
      <button
        className="flex items-center transform rounded-full"
        onClick={handlePlayBtnClick}
        id="pause"
      >
        <svg
          width="30"
          height="30"
          id={id.toString()}
          viewBox="0 0 104 04"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            id="circle"
            className={`${state === "play" ? "" : ""}`}
            cx="51"
            cy="1"
            r="50"
            strokeDasharray="314"
            strokeDashoffset="0"
          />
          <line
            id="line1"
            x1="38"
            y1="-20"
            x2="38"
            y2="20"
          />
          <path
            className="line2"
            id={`line2_${id + tab}`}
            d="M 66 -20 L 66 0 L 66 20"
            rx="10"
            ry="10"
          >
            <animate
              attributeName="d"
              dur="300ms"
              from="M 66 -20 L 66 0 L 66 20"
              to="M 38 -20 L 70 0 L 38 20"
              begin="indefinite"
              fill="freeze"
              id={`from_play_to_pause_${id + tab}`}
            />
          </path>
          <animate
            xlinkHref={`#line2_${id + tab}`}
            attributeName="d"
            dur="300ms"
            from="M 38 -20 L 70 0 L 38 20"
            to="M 66 -20 L 66 0 L 66 20"
            fill="freeze"
            id={`from_pause_to_play_${id + tab}`}
            begin="indefinite"
          />
        </svg>
      </button>
      <div className="">
        {Math.floor(end / 60)}:{String(Math.round(end) % 60).padStart(2, "0")}
      </div>
    </div>
  );
};

export default TimeStamps;
