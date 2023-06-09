import { type FC, useState } from "react";
import AllSnips from "./AllSnips";
import CurrentSnips from "./CurrentSnips";

interface Props {}

const Tabs: FC<Props> = (props) => {
  const {} = props;

  const tabs = ["Current Video Snips", "All Video Snips"];

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="flex flex-col items-center justify-center flex-nowrap">
      <header className="flex items-center justify-center w-full pt-2 text-lg px-auto flex-nowrap dark:bg-gradient-to-t dark:from-gray-950 dark:via-gray-800 dark:to-gray-800">
        <div className="self-end flex-grow border-b"></div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex items-center flex-shrink-0 px-3.5 py-2 space-x-2 ${
              index === activeTab ? "border border-b-0 rounded-t-xl" : "border-b"
            }`}
            aria-label="tab"
            onClick={() => setActiveTab(index)}
          >
            <button
              className="px-4 py-2 mx-2 font-semibold transition-colors duration-200 transform rounded-md focus:outline-none"
              aria-label="tab"
            >
              {tab}
            </button>
          </div>
        ))}
        <div className="self-end flex-grow border-b" />
      </header>
      <section className="w-full px-4">{activeTab === 0 ? <CurrentSnips /> : <AllSnips />}</section>
    </div>
  );
};

export default Tabs;
