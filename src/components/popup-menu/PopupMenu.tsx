import React, { RefObject, ReactElement } from 'react';

import './PopupMenu.css';

interface PopupMenuProps {
  parent: RefObject<HTMLElement>;
  options: string[];
  actions: Function[];
}

const PopupMenu: React.FC<PopupMenuProps> = ({ parent, options, actions }) => {
  return (
    <div className='popup'>
      {JSON.stringify(parent.current?.getBoundingClientRect())}
    </div>
  );
};

export default PopupMenu;
