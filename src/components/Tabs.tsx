import { FC, useState } from 'react';
import { Snip } from '../types';
import React from 'react';
import Tab from './Tab';

interface Props {
  currentVideoBookmarks: Snip[];
  allVideoBookmarks: Snip[];
}

const Tabs: FC<Props> = ({ currentVideoBookmarks, allVideoBookmarks }) => {
  const tabs = [{
    name: "Current Video Bookmarks",
    snips: currentVideoBookmarks
  }, {
    name: "All Video Bookmarks",
    snips: allVideoBookmarks
  }] as { name: string, snips: Snip[] }[];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="flex flex-col items-center -mx-4 sm:justify-center flex-nowrap dark:bg-gray-800 dark:text-gray-100 ">
      <ul className="flex flex-row items-center justify-center w-full mx-auto">
        {tabs.map((tab, index) => (
          <li key={index} className={`px-4 py-2 mx-2 font-semibold text-gray-700 transition-colors duration-200 transform bg-white rounded-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""} ${index === tabs.length - 1 ? "rounded-tr-md rounded-br-md" : ""} ${index === activeTab ? "bg-gray-200 dark:bg-gray-700" : ""}
          `} aria-label="tab"
            onClick={() => setActiveTab(index)}
          >
            <button className="px-4 py-2 mx-2 font-semibold text-gray-700 transition-colors duration-200 transform bg-white rounded-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700" aria-label="tab">{tab.name}</button>
          </li>
        ))}
      </ul>
      <div>
        {tabs.map((tab, index) => (
          <Tab key={index} tab={tab} activeTab={activeTab} />
        ))}
      </div>

    </section>
  );
};

export default Tabs;
