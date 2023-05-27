import React, { useMemo } from "react";
import { Snip, Tag } from "../types";
import FilterAndSort from "./FilterAndSort";

interface Props {
  snips: Snip[];
}

const CurrentSnips: React.FC<Props> = ({ snips }) => {
  // a list of all the tags for the current video
  const tags = useMemo<Tag[]>(() => {
    return snips.reduce((acc: Tag[], snip: Snip) => {
      snip.tags?.forEach((tag: Tag) => {
        if (!acc.find((t: Tag) => t.name === tag.name)) {
          acc.push(tag);
          acc.push(tag);
          acc.push(tag);
          acc.push(tag);
          acc.push(tag);


        }
      });
      return acc as Tag[];
    }, []);
  }, [snips])

  return (
    <>
      <FilterAndSort tags={tags} />
      <ul className="w-full">
        {snips.map((snip: Snip, i): JSX.Element => (
          <li key={i} className="flex flex-row w-full mb-4 border border-gray-300 rounded-md">
            <div className="flex flex-col justify-start w-full p-3">
              <div className="font-bold">{snip.title}</div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500">{Math.floor(snip.startTimestamp / 60)}:{String(Math.round(snip.startTimestamp) % 60).padStart(2, "0")}</div>
                <div className="text-gray-500">{Math.floor(snip.endTimestamp / 60)}:{String(Math.round(snip.endTimestamp) % 60).padStart(2, "0")}</div>
              </div>
            </div>
            {/* <div className="mt-2">{snip?.notes ?? ""}</div> */}
          </li>
        ))}
      </ul>

    </>);
};

export default CurrentSnips;
