import { FC, useState } from 'react';
import { Snip } from '../types';
import React from 'react';
import AllSnips from './AllSnips';
import CurrentSnips from './currentSnips';
interface Props {
  // key: number;
  tab: { name: string, snips: Snip[] };
  activeTab: number;
}


const Tab: FC<Props> = ({ tab, activeTab }) => {

  return (
    <>
      {activeTab === 0 && (
        <CurrentSnips snips={tab.snips} />
      )}
      {activeTab === 1 && (
        <AllSnips snips={tab.snips} />
      )}
    </>);
};

export default Tab;