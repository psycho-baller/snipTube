import { useMemo, type FC, useEffect } from "react";
import type { Snip, Tag } from "~lib/types";
import Topbar from "./Topbar";
import YtSnip from "./YtSnip";
import { useSnipsStore } from "~stores/sniptube";
import { getSnips } from "~lib/storage";
import NoSnips from "./NoSnips";
import { sortByOptions } from "~lib/constants";

interface Props {
  className?: string;
}

const CurrentSnips: FC<Props> = (props) => {
  const { className } = props;

  const snips: Snip[] = useSnipsStore((state) => state.snips);
  const setCurrentVideoSnips = useSnipsStore((state) => state.setSnips);
  const sortBy = useSnipsStore((state) => state.sortBy);
  useEffect(() => {
    getSnips().then((snips) => setCurrentVideoSnips(snips));
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case sortByOptions[0]:
        setCurrentVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
        break;
      case sortByOptions[1]:
        setCurrentVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case sortByOptions[2]:
        setCurrentVideoSnips(snips.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case sortByOptions[3]:
        setCurrentVideoSnips(snips.sort((a, b) => b.title.localeCompare(a.title)));
        break;
      case sortByOptions[4]:
        setCurrentVideoSnips(snips.sort((a, b) => a.endTimestamp - b.endTimestamp));
        break;
      case sortByOptions[5]:
        setCurrentVideoSnips(snips.sort((a, b) => b.endTimestamp - a.endTimestamp));
        break;
      default:
        // most recent (newest) first
        setCurrentVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
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
          <ul className="">
            {snips.map(
              (snip: Snip, i): JSX.Element => (
                <YtSnip
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

export default CurrentSnips;
