import React, { useEffect, useMemo } from "react";
import type { Snip, Tag } from "../utils/types";
import { useAllSnipsStore } from "~utils/store";
import FilterAndSort from "./FilterAndSort";
import YtSnip from "./YtSnip";
import { getAllSnips } from "~utils/storage";

interface Props {
}

const AllSnips: React.FC<Props> = (props) => {
  const { } = props;

  const snips: Snip[] = useAllSnipsStore((state) => state.snips);
  const setAllVideoSnips = useAllSnipsStore((state) => state.setSnips);

  useEffect(() => {

    // get all the snips
    getAllSnips().then((allSnips) => { console.log(allSnips); setAllVideoSnips(allSnips) });
    console.log("snips", snips);
  }, []);


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
      {(snips.length > 0) ? (
        <>
          <FilterAndSort tags={tags} />
          <ul className="w-full">
            {snips.map((snip: Snip, i): JSX.Element => (
              <YtSnip key={i} snip={snip} index={i} />
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-96">
          <h1 className="text-2xl font-semibold">No Snips Found</h1>
          <p className="text-lg text-center">Add a snip to this video by clicking the "+" icon in the bottom right corner of the video.</p>
        </div>
      )}
      <li className="flex flex-row mb-4 border border-gray-300 rounded-md">
        <img className="h-full" src="https://i.ytimg.com/vi/3qYbVjg5Z7k/hqdefault.jpg" alt="thumbnail" />
        <div className="flex flex-col justify-start w-full p-3">
          <div className="font-bold">{"snip.title"}</div>
          <div className="flex flex-row justify-between">
            <div className="text-gray-500">{60}:{String(Math.round(60))}</div>
            <div className="text-gray-500">{60}:{String(Math.round(60))}</div>

          </div>
        </div>
        {/* <div className="flex">
                    {snip?.tags?.map((tag: Tag, i: number) => (
                      <div key={i} className={`bg-${tag.color ?? "gray"}-300 rounded-full px-2 py-1 text-xs mr-2 border border-${tag.color ?? "gray"}-400`}>{tag.name}</div>
                    ))}
                  </div> */}
        {/* <div className="mt-2">{snip?.notes ?? ""}</div> */}
      </li>
    </ >
  );
};

export default AllSnips;
