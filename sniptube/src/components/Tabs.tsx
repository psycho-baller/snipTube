import { FC, Fragment, useState } from 'react';
import { Snip } from '../types';
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
        <li className="self-end flex-grow h-full border-b"></li>
        {tabs.map((tab, index) => (
          <li key={index} className={`flex items-center flex-shrink-0 px-3.5 py-2 space-x-2 ${index === activeTab ? "border border-b-0 rounded-t-xl" : "border-b"}`}
            aria-label="tab"
            onClick={() => setActiveTab(index)}
          >
            <button className="px-4 py-2 mx-2 font-semibold transition-colors duration-200 transform rounded-md focus:outline-none" aria-label="tab">{tab.name}</button>
          </li>
        ))}
        <li className="self-end flex-grow h-full border-b"></li>
        {/* <div className="border-b"></div> */}
        {/* </li> */}
      </ul >
      <div className="w-full px-4">
        {tabs.map((tab, index) => {
          return (
            <Fragment key={index}>
              {activeTab === 0 ? (
                <CurrentSnips snips={tab.snips} />
              ) : (
                <AllSnips snips={tab.snips} />
              )}
            </Fragment>
          );
        })}
      </div >

    </section >
  );
};

export default Tabs;
