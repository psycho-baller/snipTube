import { type FC } from 'react';
import { type Snip, type Tag } from '../utils/types';
import Dropdown from './Dropdown';
import ExportButton from './ExportButton';
import SettingsButton from './SettingsButton';

interface Props {
  tags: Tag[];
  // depending on the page, either allSnips or snips will be defined and from that we can also tell the dropdown what to sort for and the tag filter what to filter for
  allSnips?: Snip[];
  snips?: Snip[];
}

const Header: FC<Props> = (props) => {
  const { tags, allSnips = undefined, snips = undefined } = props;

  return (
    <div className="flex my-4 -mx-4">
      <div className="flex mr-2 overflow-x-auto rounded-full no-scrollbar">
        <div className="flex pl-4"></div>
        {tags.map((tag: Tag, i: number) => (
          <button key={i} className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center bg-${tag.color ? tag.color : "slate"}-700`}>{tag.name}</button>
        ))}
      </div>
      {/* sort at the right corner */}
      <div className={`flex gap-2 ${allSnips?.length > 4 || snips?.length > 4 ? '' : 'pr-4'}`}>
        <ExportButton snips={allSnips ?? snips} />
        <SettingsButton />
        {(allSnips?.length > 4 || snips?.length > 4) && <Dropdown />}
      </div>
      {/* <div className="flex pr-4">
          <ExportButton snips={allSnips ?? snips} />
          <SettingsButton />
        </div> */}
    </div>
  );
};

export default Header;
