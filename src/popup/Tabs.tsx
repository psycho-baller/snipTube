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
      <nav className="grid grid-cols-2 text-center text-lg">
        <div
          className={`self-center justify-center py-4 ${
            0 === activeTab ? "" : "border-b border-r border-gray-600 bg-gray-800"
          }`}
          aria-label="tab"
          onClick={() => setActiveTab(0)}
        >
          <button className=" text-center font-semibold transition-colors duration-200 transform rounded-md focus:outline-none">
            {tabs[0]}
          </button>
        </div>

        <div
          className={`self-center justify-center py-4 ${
            1 === activeTab ? "" : "border-b border-l border-gray-600 bg-gray-800"
          }`}
          aria-label="tab"
          onClick={() => setActiveTab(1)}
        >
          <button className="text-center font-semibold transition-colors duration-200 transform rounded-md focus:outline-none">
            {tabs[1]}
          </button>
        </div>
      </nav>
      {activeTab === 0 ? <CurrentSnips className="flex-grow px-4 " /> : <AllSnips className="flex-grow px-4 " />}
    </div>
  );
};

export default Tabs;
