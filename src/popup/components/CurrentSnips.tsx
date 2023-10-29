import { useMemo, type FC, useEffect, useState } from "react";
import type { Snip, Tag } from "~lib/types";
import Topbar from "./Topbar";
import YtSnip from "./YtSnip";
import { useAllSnipsStore, useSnipsStore } from "~stores/sniptube";
import { getSnips } from "~lib/storage";
import NoSnips from "./NoSnips";
import { filterAndSortSnips } from "~lib/utils";

interface Props {
  className?: string;
}

const CurrentSnips: FC<Props> = (props) => {
  const { className } = props;

  const snips: Snip[] = useSnipsStore((state) => state.snips);
  const allSnips: Snip[] = useAllSnipsStore((state) => state.snips);
  const setCurrentVideoSnips = useSnipsStore((state) => state.setSnips);
  const [sortBy, selectedTags] = useSnipsStore((state) => [state.sortBy, state.selectedTags]);

  useEffect(() => {
    getSnips().then((snips) => setCurrentVideoSnips(snips));
  }, []);

  const filteredAndSortedSnips = useMemo(() => {
    return filterAndSortSnips(snips, sortBy, selectedTags);
  }, [snips, sortBy, selectedTags]);

  // useEffect(() => {
  //   switch (sortBy) {
  //     case sortByOptions[0]:
  //       setCurrentVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
  //       break;
  //     case sortByOptions[1]:
  //       setCurrentVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
  //       break;
  //     case sortByOptions[2]:
  //       setCurrentVideoSnips(snips.sort((a, b) => a.title.localeCompare(b.title)));
  //       break;
  //     case sortByOptions[3]:
  //       setCurrentVideoSnips(snips.sort((a, b) => b.title.localeCompare(a.title)));
  //       break;
  //     case sortByOptions[4]:
  //       setCurrentVideoSnips(snips.sort((a, b) => a.endTimestamp - b.endTimestamp));
  //       break;
  //     case sortByOptions[5]:
  //       setCurrentVideoSnips(snips.sort((a, b) => b.endTimestamp - a.endTimestamp));
  //       break;
  //     default:
  //       // most recent (newest) first
  //       setCurrentVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
  //       break;
  //   }
  // }, [sortBy]);

  // a list of all the tags for the current video
  // TODO: reuse instead of calling it twice
  const tags = useMemo<Tag[]>(() => {
    return allSnips.reduce((acc: Tag[], snip: Snip) => {
      snip.tags?.forEach((tag: Tag) => {
        if (!acc.find((t: Tag) => t.name === tag.name)) {
          acc.push(tag);
        }
      });
      return acc as Tag[];
    }, []);
  }, [allSnips]);

  return (
    <div className={`flex flex-col ${className}`}>
      <Topbar tags={tags} />
      {filteredAndSortedSnips.length > 0 ? (
        <main>
          <ul className="">
            {filteredAndSortedSnips.map(
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
