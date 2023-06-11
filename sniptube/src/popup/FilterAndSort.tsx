import { type FC } from 'react';
import { type Tag } from '../utils/types';
import Dropdown from './Dropdown';

interface Props {
  tags: Tag[];
}

const Component: FC<Props> = (props) => {
  const { tags } = props;


  return (
    <div className="flex my-4 -mx-4">
      {/* transparent bg */}
      <div className="flex overflow-x-auto">
        <div className="flex pl-4"></div>
        {tags.map((tag: Tag, i: number) => (
          <div key={i} className={`rounded-3xl px-2 py-1 text-xs mr-2 self-center border border-slate-400 bg-${tag.color ?? "yellow"}-300`}>{tag.name}</div>
        ))}
      </div>
      {/* sort at the right corner */}
      <div className="flex">
        <Dropdown />
      </div>
    </div>
  );
};

export default Component;
