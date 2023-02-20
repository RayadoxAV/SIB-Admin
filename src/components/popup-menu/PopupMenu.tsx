import React, { RefObject, ReactElement, useEffect, useState, HTMLAttributes } from 'react';

import './PopupMenu.css';

interface PopupMenuProps {
  parent: RefObject<HTMLElement>;
  options: string[];
  actions: Function[];
}

const PopupMenu: React.FC<PopupMenuProps> = ({ parent, options, actions }) => {


  // const style = { top: 0 };
  useEffect(() => {
    // style.top = '100px';
      // style.top = `${position.top + position.height + 80}px`;
    
  }, [parent]);

  return (
    <div className='popup'>
      
    </div>
  );
};

export default PopupMenu;
