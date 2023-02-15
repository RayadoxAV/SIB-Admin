import React, { useContext } from 'react';

import { appWindow } from  '@tauri-apps/api/window';

import './TitleBar.css';
import { AppContext } from '../../State';

interface TitleBarProps {
  title?: String;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {

  const [state, _] = useContext(AppContext);

  function handleMinimize() {
    appWindow.minimize();
  }

  function handleMaximize() {
    appWindow.toggleMaximize();
  }

  function handleClose() {
    appWindow.close();
  }

  return (
    <div data-tauri-drag-region className='title-bar'>
      <div className='icon'>
        <i className='fa-solid fa-bookmark' style={{ color: '#0c58d0' }}></i>
      </div>
      <div className='title-container'>{ state.title }</div>
      <div className='window-controls-container'>
        <button className='window-control codicon codicon-chrome-minimize' onClick={handleMinimize}></button>
        <button className='window-control codicon codicon-chrome-maximize' onClick={handleMaximize}></button>
        <button className='window-control close-button codicon codicon-chrome-close' onClick={handleClose}></button>
      </div>
    </div>
  )
};

export default TitleBar;
