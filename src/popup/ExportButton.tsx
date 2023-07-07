import { useState, type FC, type MouseEvent } from 'react';
import type { Snip } from '~utils/types';
import { exportSnip, exportSnips } from '~utils/exportSnips';
interface Props {
  className?: string;
  snips?: Snip[];
  snip?: Snip;
}

const ExportButton: FC<Props> = (props) => {
  const { className = 'w-5', snips = undefined, snip = undefined } = props;

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
    <button className="relative flex self-center justify-center p-1 rounded-full group bg-slate-600" onClick={exportSnipHandleClick}>
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
      <span className="absolute z-50 w-auto p-1 text-xs capitalize transition-all duration-100 origin-bottom scale-0 bg-white rounded-md shadow-md dark:bg-slate-900 dark:text-slate-100 text-slate-800 min-w-max bottom-7 group-hover:delay-300 group-hover:scale-100">{copied ? 'Copied!' : `Export ${snips ? ' all snips' : 'snip'}`}</span>
    </button>
  );
};

export default ExportButton;
