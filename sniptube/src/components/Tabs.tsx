import { type FC, Fragment, useState } from 'react';
import type { Snip } from '../types';
import React from 'react';
import AllSnips from './AllSnips';
import CurrentSnips from './CurrentSnips';

interface Props {
  currentVideoSnips: Snip[];
  allVideoSnips: Snip[];
}

const Tabs: FC<Props> = ({ currentVideoSnips, allVideoSnips }) => {
  const tabs = [{
    name: "Current Video Snips",
    snips: currentVideoSnips
  }, {
    name: "All Video Snips",
    snips: allVideoSnips
  }] as { name: string, snips: Snip[] }[];

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section className="flex flex-col items-center justify-center flex-nowrap dark:bg-slate-950 dark:text-slate-100 ">
      <ul className="flex items-center justify-center w-full pt-2 text-lg px-auto flex-nowrap dark:bg-gradient-to-t dark:from-slate-950 dark:via-slate-800 dark:to-slate-800">
        <li className="self-end flex-grow border-b"></li>
        {tabs.map((tab, index) => (
          <li key={index} className={`flex items-center flex-shrink-0 px-3.5 py-2 space-x-2 ${index === activeTab ? "border border-b-0 rounded-t-xl" : "border-b"}`}
            aria-label="tab"
            onClick={() => setActiveTab(index)}
          >
            <button className="px-4 py-2 mx-2 font-semibold transition-colors duration-200 transform rounded-md focus:outline-none" aria-label="tab">{tab.name}</button>
          </li>
        ))}
        <li className="self-end flex-grow border-b"></li>
        {/* <div className="border-b"></div> */}
        {/* </li> */}
      </ul>
      <div className="w-full px-4">
        {(activeTab === 0) ? (
          (currentVideoSnips.length > 0) ? (
            <CurrentSnips snips={currentVideoSnips} />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-96">
              <h1 className="text-2xl font-semibold">No Snips Found</h1>
              <p className="text-lg text-center">Add a snip to this video by clicking the "+" icon in the bottom right corner of the video.</p>
            </div>
          )
        ) : (
          <AllSnips snips={allVideoSnips} />
        )}
      </div>

    </section>
  );
};

export default Tabs;
