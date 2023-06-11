import React from "react";
import type { Snip } from "../utils/types";
import { useAllSnipsStore } from "~utils/store";

interface Props {
}

const AllSnips: React.FC<Props> = (props) => {
  const { } = props;

  const snips: Snip[] = useAllSnipsStore((state) => state.snips);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-center">
        All Video Snips</h1>
      <ul>
        {snips.map((snip: Snip, i): JSX.Element => (
          <li key={i} className="flex flex-row mb-4 border border-gray-300 rounded-md">
            <img className="h-full" src="https://i.ytimg.com/vi/3qYbVjg5Z7k/hqdefault.jpg" alt="thumbnail" />
            <div className="flex flex-col justify-start w-full p-3">
              <div className="font-bold">{snip.title}</div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500">{Math.floor(snip.startTimestamp / 60)}:{String(Math.round(snip.startTimestamp) % 60).padStart(2, "0")}</div>
                <div className="text-gray-500">{Math.floor(snip.endTimestamp / 60)}:{String(Math.round(snip.endTimestamp) % 60).padStart(2, "0")}</div>

              </div>
            </div>
            {/* <div className="flex">
                    {snip?.tags?.map((tag: Tag, i: number) => (
                      <div key={i} className={`bg-${tag.color ?? "gray"}-300 rounded-full px-2 py-1 text-xs mr-2 border border-${tag.color ?? "gray"}-400`}>{tag.name}</div>
                    ))}
                  </div> */}
            {/* <div className="mt-2">{snip?.notes ?? ""}</div> */}
          </li>
        ))}
      </ul>

    </>);
};

export default AllSnips;
