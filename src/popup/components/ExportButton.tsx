import { useState, type FC, type MouseEvent } from "react";
import type { Snip } from "~lib/types";
import { exportSnip, exportSnips } from "~lib/utils";
interface Props {
  className?: string;
  snips?: Snip[];
  snip?: Snip;
}

const ExportButton: FC<Props> = (props) => {
  const { className = "w-5", snips, snip } = props;

  const [copied, setCopied] = useState<boolean>(false);

  function exportSnipHandleClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (snips) {
      exportSnips(snips);
      setCopied(true);
    } else if (snip) {
      exportSnip(snip);
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      // disabled only when: 1. no snips and no snip given, 2. no snips in snips array
      disabled={snips?.length === 0 && !snip}
      className="relative flex self-center justify-center p-1 bg-gray-700 rounded-full group disabled:opacity-70"
      onClick={exportSnipHandleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        data-name="Flat Line"
        viewBox="0 0 24 24"
      >
        <path
          d="M15 3h6v6"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.8,
          }}
        />
        <path
          d="M11 13 21 3M21 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"
          data-name="primary"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.8,
          }}
        />
      </svg>
      <span className="absolute z-50 w-auto p-1 text-xs text-gray-800 capitalize transition-all duration-100 origin-bottom scale-0 bg-white rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 min-w-max bottom-7 group-hover:delay-300 group-hover:scale-100">
        {copied ? "Copied!" : `Export ${snips ? " all snips" : "snip"}`}
      </span>
    </button>
  );
};

export default ExportButton;
