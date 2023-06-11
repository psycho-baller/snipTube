import { useMemo, type FC } from "react";
import type { Snip, Tag } from "~utils/types";
import FilterAndSort from "./FilterAndSort";
import YtSnip from "./YtSnip";
import { useSnipsStore } from "~utils/store";

interface Props {
}

const CurrentSnips: FC<Props> = (props) => {
  const { } = props;

  const snips: Snip[] = useSnipsStore((state) => state.snips);


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
    </>
  );
};

export default CurrentSnips;
