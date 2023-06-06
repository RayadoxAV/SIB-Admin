import React from 'react';

interface ActionItemProps {
  icon: string;
  title: string;
  onClick: Function;
  dangerous?: boolean
};

const ActionItem: React.FC<ActionItemProps> = ({ icon, title, onClick, dangerous = false }) => {

  function handleClick() {
    onClick();
  }
  
  return (
    <button className={`action-item ${dangerous ? 'dangerous' : ''}`} onClick={handleClick}>
      <span className='icon'>
        <i className={`fa-solid ${icon}`}></i>
      </span>
      <span className='title'>{title}</span>
    </button>
  );
};

export default ActionItem;
