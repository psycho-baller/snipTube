import React, { FC } from 'react';
import { Tag } from '../types';
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
          <div key={i} className={`bg-${tag.color ?? "yellow"}-300 rounded-full px-2 py-1 text-xs mr-2 self-center border border-${tag.color ?? "gray"}-400`}>{tag.name}</div>
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
