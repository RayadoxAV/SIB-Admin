import React, { useContext, useState } from 'react';

import { appWindow } from  '@tauri-apps/api/window';

import './TitleBar.css';
import { AppContext } from '../../State';

interface TitleBarProps {
  title?: String;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {

  const [state, _] = useContext(AppContext);
  const [maximized, setMaximized] = useState(true);

  function handleMinimize() {
    appWindow.minimize();
  }

  async function handleMaximize() {
    await appWindow.toggleMaximize();
    const isMaximized = await appWindow.isMaximized();
    setMaximized(isMaximized);

    //@ts-ignore
    document.getElementsByClassName('App')[0].style.borderRadius = isMaximized ? '0rem' : '0.5rem';
  }

  function handleClose() {
    appWindow.close();
  }

  return (
    <div id='title-bar' data-tauri-drag-region className='title-bar' style={{ borderRadius: maximized ? '0rem' : '0.5rem 0.5rem 0rem 0rem' }}>
      <div className='icon'>
        <i className='fa-solid fa-bookmark' style={{ color: '#0c58d0' }}></i>
      </div>
      <div className='title-container'>{ state.title }</div>
      <div className='window-controls-container'>
        <button className='window-control codicon codicon-chrome-minimize' onClick={handleMinimize}></button>
        <button className='window-control codicon codicon-chrome-maximize' onClick={handleMaximize}></button>
        <button style={{ borderRadius: maximized ? '0rem' : '0rem 0.5rem 0rem 0rem' }} className='window-control close-button codicon codicon-chrome-close' onClick={handleClose}></button>
      </div>
    </div>
  )
};

export default TitleBar;
