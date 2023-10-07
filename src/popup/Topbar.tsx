import { type FC } from "react";
import { type Snip, type Tag } from "../lib/types";
import Dropdown from "./Dropdown";
import ExportButton from "./ExportButton";
import SettingsButton from "./SettingsButton";
import { useContentScriptStore } from "~stores/sniptube";

interface Props {
  tags: Tag[];
  // depending on the page, either allSnips or snips will be defined and from that we can also tell the dropdown what to sort for and the tag filter what to filter for
  allSnips?: Snip[];
  snips?: Snip[];
}

const Header: FC<Props> = (props) => {
  const { tags, allSnips, snips } = props;

  const inYoutube = useContentScriptStore((state) => state.inYoutube);

  const hasMoreThanFour = allSnips?.length > 4 || snips?.length > 4;
  const takeUpFullHeight = allSnips?.length > 6 || snips?.length > 2;

  return (
    <header className={"flex sticky bg-gray-950 py-3 -mx-4 z-10" + (inYoutube ? "  top-[3.8rem]" : " top-0")}>
      <div className="flex mr-2 overflow-x-auto rounded-full scrollbar-hidden">
        <div className="flex pl-4"></div>
        {tags.map((tag: Tag, i: number) => (
          <button
            key={i}
            className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center whitespace-nowrap bg-${
              tag.color ? tag.color : "gray"
            }-700`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      {/* sort at the right corner */}
      <div className={`flex justify-end flex-1 gap-2 ${hasMoreThanFour ? "" : "pr-4"}`}>
        <ExportButton snips={allSnips ?? snips} />
        <SettingsButton
          stickRight={!hasMoreThanFour}
          takeUpFullHeight={takeUpFullHeight}
        />
        {hasMoreThanFour && <Dropdown />}
      </div>
    </header>
  );
};

export default Header;
