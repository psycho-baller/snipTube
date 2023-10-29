import { type FC, useEffect, useMemo, useState, type ComponentPropsWithoutRef } from "react";
import type { Snip, Tag } from "../../lib/types";
import { useAllSnipsStore, useSnipsStore } from "~stores/sniptube";
import Topbar from "./Topbar";
import { getAllSnips } from "~lib/storage";
import OutsideSnip from "./OutsideSnip";
import NoSnips from "./NoSnips";
import { filterAndSortSnips } from "~lib/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {}

const AllSnips: FC<Props> = (props) => {
  const { className } = props;

  const [sortBy, selectedTags] = useSnipsStore((state) => [state.sortBy, state.selectedTags]);
  const [snips, setAllVideoSnips] = useAllSnipsStore((state) => [state.snips, state.setSnips]);

  useEffect(() => {
    getAllSnips().then((allSnips) => setAllVideoSnips(allSnips));
  }, []);

  const filteredAndSortedSnips = useMemo(() => {
    return filterAndSortSnips(snips, sortBy, selectedTags);
  }, [snips, sortBy, selectedTags]);

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
        allSnips={filteredAndSortedSnips}
      />
      {filteredAndSortedSnips.length > 0 ? (
        <main>
          <ul className="w-full overflow-scroll">
            {filteredAndSortedSnips.map(
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
