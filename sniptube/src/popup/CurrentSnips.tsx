import { Fragment, useMemo } from "react";
import type { Snip, Tag } from "~types";
import FilterAndSort from "./FilterAndSort";
import YtSnip from "./YtSnip";

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
          <Fragment key={i} >
            <YtSnip snip={snip} />
          </Fragment>
        ))}
      </ul>
    </>);
};

export default CurrentSnips;
