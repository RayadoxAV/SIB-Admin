import React, { ReactNode, useState } from 'react';

import './TabPanel.css';

interface TabPanelProps {
  tabs: string[];
  closable?: boolean;
};

type TabPanelPropsWithChildren<Props> = Props & { children?: ReactNode[] };

const TabPanel: React.FC<TabPanelPropsWithChildren<TabPanelProps>> = ({ tabs, children, closable = false }) => {

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  function selectTab(index: number) {
    setCurrentTabIndex(index);
  }

  return (
    <div className='tab-panel'>
      <div className='tabs-container'>
        {tabs.map((tab: string, index: number) => (
          <div className={`tab tab-fade-in-up delay-${index + 2} ${currentTabIndex === index ? 'active' : ''}`} key={index} onClick={() => { selectTab(index) }}>
            <span className='title'>{tab}</span>
          </div>
        ))}
      </div>
      <div className='tab-wrapper'>
        {
          children ?
          (
            children[currentTabIndex] || ('You screwd up')
          ) :
          (
            null
          )
        }
      </div>
    </div>
  )
};

export default TabPanel;
