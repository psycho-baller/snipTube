import { useMemo, type FC } from "react";
import { useSnipsStore } from "~lib/store";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const SnipBtn: FC<Props> = (props) => {
  const { videoRef, ...rest } = props;

  const snips = useSnipsStore((state) => state.snips);
  const addSnipStore = useSnipsStore((state) => state.addSnip);

  // useMemo(() => {
    // place snips in the store into the video p

  function addSnip(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const video = videoRef.current;
    if (!video) return;
    const currentTime = ~~video.currentTime;
    const videoId = snips.length.toString();
    addSnipStore({
      startTimestamp: currentTime - 30,
      endTimestamp: currentTime,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      videoId: videoId,
      title: "AI generated summary",
      vidTitle: video.title,
      id: videoId,
      note: "",
      tags: [],
    });
  }

  return (
    <button onClick={addSnip} {...rest} title="Create a snip (s)">
      <svg
        // style="padding: 0.75rem; width: 100%; height: 100%;"
        xmlns="http://www.w3.org/2000/svg"
        // width="500"
        zoomAndPan="magnify"
        viewBox="0 0 375 374.999991"
        // height="500"
        preserveAspectRatio="xMidYMid meet"
        version="1.0"
        className="p-1 w-full h-full"
      >
        <path
          fill="#ffffff"
          d="M 312.5 0 L 62.5 0 C 27.082031 0 0 27.082031 0 62.5 L 0 208.332031 C 0 220.832031 8.332031 229.167969 20.832031 229.167969 L 137.5 229.167969 L 158.332031 208.332031 L 89.582031 139.582031 C 81.25 131.25 81.25 118.75 89.582031 110.417969 C 97.917969 102.082031 110.417969 102.082031 118.75 110.417969 L 187.5 179.167969 L 256.25 110.417969 C 264.582031 102.082031 277.082031 102.082031 285.417969 110.417969 C 293.75 118.75 293.75 131.25 285.417969 139.582031 L 216.667969 208.332031 L 237.5 229.167969 L 354.167969 229.167969 C 366.667969 229.167969 375 220.832031 375 208.332031 L 375 62.5 C 375 27.082031 347.917969 0 312.5 0 Z M 312.5 0 "
          fillOpacity="1"
          fillRule="nonzero"
        />
        <path
          fill="#ffffff"
          d="M 110.417969 256.25 C 102.082031 252.082031 93.75 250 83.332031 250 C 47.917969 250 20.832031 277.082031 20.832031 312.5 C 20.832031 347.917969 47.917969 375 83.332031 375 C 118.75 375 145.832031 347.917969 145.832031 312.5 C 145.832031 302.082031 143.75 293.75 139.582031 285.417969 L 187.5 237.5 L 235.417969 285.417969 C 231.25 293.75 229.167969 302.082031 229.167969 312.5 C 229.167969 347.917969 256.25 375 291.667969 375 C 327.082031 375 354.167969 347.917969 354.167969 312.5 C 354.167969 277.082031 327.082031 250 291.667969 250 C 281.25 250 272.917969 252.082031 264.582031 256.25 L 237.5 229.167969 L 137.5 229.167969 Z M 83.332031 333.332031 C 70.832031 333.332031 62.5 325 62.5 312.5 C 62.5 300 70.832031 291.667969 83.332031 291.667969 C 95.832031 291.667969 104.167969 300 104.167969 312.5 C 104.167969 325 95.832031 333.332031 83.332031 333.332031 Z M 291.667969 291.667969 C 304.167969 291.667969 312.5 300 312.5 312.5 C 312.5 325 304.167969 333.332031 291.667969 333.332031 C 279.167969 333.332031 270.832031 325 270.832031 312.5 C 270.832031 300 279.167969 291.667969 291.667969 291.667969 Z M 291.667969 291.667969 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </svg>
    </button>
  );
};

export default SnipBtn;