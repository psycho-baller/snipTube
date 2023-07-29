import { useMemo, type FC, useEffect } from "react";
import type { Snip, Tag } from "src/utils/types";
import Topbar from "./Topbar";
import YtSnip from "./YtSnip";
import { useSnipsStore } from "src/utils/store";
import { getSnips } from "src/utils/storage";
import NoSnips from "./NoSnips";

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
      case "Newest":
        setCurrentVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case "Oldest":
        setCurrentVideoSnips(snips.sort((a, b) => a.createdAt - b.createdAt));
        break;
      case "A-Z":
        setCurrentVideoSnips(snips.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case "Z-A":
        setCurrentVideoSnips(snips.sort((a, b) => b.title.localeCompare(a.title)));
        break;
      case "End time":
        setCurrentVideoSnips(snips.sort((a, b) => a.endTimestamp - b.endTimestamp));
        break;
      case "Tag (A-Z)":
        setCurrentVideoSnips(snips.sort((a, b) => a.tags[0].name.localeCompare(b.tags[0].name)));
        break;
      case "Tag (Z-A)":
        setCurrentVideoSnips(snips.sort((a, b) => b.tags[0].name.localeCompare(a.tags[0].name)));
        break;
      default:
        setCurrentVideoSnips(snips.sort((a, b) => b.createdAt - a.createdAt));
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
