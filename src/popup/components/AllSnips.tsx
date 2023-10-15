import { type FC, useEffect, useMemo } from "react";
import type { Snip, Tag } from "../../lib/types";
import { useAllSnipsStore, useSnipsStore } from "~stores/sniptube";
import Topbar from "./Topbar";
import { getAllSnips } from "~lib/storage";
import OutsideSnip from "./OutsideSnip";
import NoSnips from "./NoSnips";
import { sortByOptions } from "~lib/constants";

interface Props {
  className?: string;
}

const AllSnips: FC<Props> = (props) => {
  const { className } = props;

  const snips: Snip[] = useAllSnipsStore((state) => state.snips);
  const setAllVideoSnips = useAllSnipsStore((state) => state.setSnips);
  const sortBy = useSnipsStore((state) => state.sortBy);

  useEffect(() => {
    getAllSnips().then((allSnips) => setAllVideoSnips(allSnips));
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case sortByOptions[0]:
        setAllVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
        break;
      case sortByOptions[1]:
        setAllVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case sortByOptions[2]:
        setAllVideoSnips(snips.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case sortByOptions[3]:
        setAllVideoSnips(snips.sort((a, b) => b.title.localeCompare(a.title)));
        break;
      case sortByOptions[4]:
        setAllVideoSnips(snips.sort((a, b) => a.endTimestamp - b.endTimestamp));
        break;
      case sortByOptions[5]:
        setAllVideoSnips(snips.sort((a, b) => b.endTimestamp - a.endTimestamp));
        break;
      default:
        setAllVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
        break;
    }
  }, [sortBy, snips]);

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
