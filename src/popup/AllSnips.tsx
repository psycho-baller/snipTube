import React, { useEffect, useMemo } from "react";
import type { Snip, Tag } from "../utils/types";
import { useAllSnipsStore } from "src/utils/store";
import Topbar from "./Topbar";
import { getAllSnips } from "src/utils/storage";
import OutsideSnip from "./OutsideSnip";
import NoSnips from "./NoSnips";

interface Props {
  className?: string;
}

const AllSnips: React.FC<Props> = (props) => {
  const { className } = props;

  const snips: Snip[] = useAllSnipsStore((state) => state.snips);
  const setAllVideoSnips = useAllSnipsStore((state) => state.setSnips);

  useEffect(() => {
    getAllSnips().then((allSnips) => setAllVideoSnips(allSnips));
  }, []);

  // a list of all the tags for the current video
  const tags = useMemo<Tag[]>(() => {
    return snips.reduce((acc: Tag[], snip: Snip) => {
      snip.tags?.forEach((tag: Tag) => {
        if (!acc.find((t: Tag) => t.name === tag.name)) {
          acc.push(tag);
          // acc.push(tag);
          // acc.push(tag);
          // acc.push(tag);
          // acc.push(tag);
        }
      });
      return acc as Tag[];
    }, []);
  }, [snips]);
  return (
    <div className={`flex flex-col ${className}`}>
      <Topbar
        tags={tags}
        allSnips={snips}
      />
      {snips.length > 0 ? (
        <main>
          <ul className="w-full overflow-scroll">
            {snips.map(
              (snip: Snip, i): JSX.Element => (
                <OutsideSnip
                  key={i}
                  snip={snip}
                />
              )
            )}
          </ul>
        </main>
      ) : (
        <NoSnips />
      )}
    </div>
  );
};

export default AllSnips;
