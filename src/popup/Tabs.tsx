import { type FC, useState } from "react";
import AllSnips from "./AllSnips";
import CurrentSnips from "./CurrentSnips";

interface Props {
  className?: string;
}

const Tabs: FC<Props> = (props) => {
  const { className } = props;

  const tabs = ["Current Video Snips", "All Video Snips"];

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className={`flex flex-col ${className}`}>
      <nav className="grid grid-cols-2 text-center text-lg sticky top-0 z-10">
        <button
          className={`self-center justify-center py-4 border-b border-r ${
            0 === activeTab ? "dark:border-gray-950 dark:bg-gray-950" : "dark:border-gray-600 dark:bg-gray-800"
          }`}
          aria-label="tab"
          onClick={() => setActiveTab(0)}
        >
          <p className=" text-center font-semibold transition-colors duration-200 transform rounded-md focus:outline-none">
            {tabs[0]}
          </p>
        </button>

        <button
          className={`self-center justify-center py-4 border-b border-l ${
            1 === activeTab ? "dark:border-gray-950 dark:bg-gray-950" : "dark:border-gray-600 dark:bg-gray-800"
          }`}
          aria-label="tab"
          onClick={() => setActiveTab(1)}
        >
          <p className="text-center font-semibold transition-colors duration-200 transform rounded-md focus:outline-none">
            {tabs[1]}
          </p>
        </button>
      </nav>
      {activeTab === 0 ? <CurrentSnips className="flex-grow px-4 " /> : <AllSnips className="flex-grow px-4 " />}
    </div>
  );
};

export default Tabs;
