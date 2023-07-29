import React, { useEffect, useMemo } from "react";
import type { Snip, Tag } from "../utils/types";
import { useAllSnipsStore, useSnipsStore } from "src/utils/store";
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
  const sortBy = useSnipsStore((state) => state.sortBy);

  useEffect(() => {
    getAllSnips().then((allSnips) => setAllVideoSnips(allSnips));
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case "Newest":
        setAllVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case "Oldest":
        setAllVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
        break;
      case "A-Z":
        setAllVideoSnips(snips.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case "Z-A":
        setAllVideoSnips(snips.sort((a, b) => b.title.localeCompare(a.title)));
        break;
      case "End time":
        setAllVideoSnips(snips.sort((a, b) => a.endTimestamp - b.endTimestamp));
        break;
      case "Tag (A-Z)":
        setAllVideoSnips(snips.sort((a, b) => a.tags[0].name.localeCompare(b.tags[0].name)));
        break;
      case "Tag (Z-A)":
        setAllVideoSnips(snips.sort((a, b) => b.tags[0].name.localeCompare(a.tags[0].name)));
        break;
      default:
        setAllVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
        break;
    }
  }, [sortBy]);

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
        snips={snips}
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
