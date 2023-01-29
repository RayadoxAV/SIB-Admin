import React, { useState } from 'react';

import { appWindow } from  '@tauri-apps/api/window';

import './TitleBar.css';

interface TitleBarProps {
  title?: String;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {

  function handleMinimize() {
    appWindow.minimize();
  }

  function handleMaximize() {
    appWindow.toggleMaximize();
  }

  function handleClose() {
    // appWindow.close();
  }

  return (
    <div data-tauri-drag-region className='title-bar'>
      <div className='icon'>
        <i className='fa-solid fa-bookmark'></i>
      </div>
      <div className='title-container'>{ title ? title: 'SI' }</div>
      <div className='window-controls-container'>
        <button className='window-control codicon codicon-chrome-minimize' onClick={handleMinimize}></button>
        <button className='window-control codicon codicon-chrome-maximize' onClick={handleMaximize}></button>
        <button className='window-control close-button codicon codicon-chrome-close' onClick={handleClose}></button>
      </div>
    </div>
  )
};

export default TitleBar;
