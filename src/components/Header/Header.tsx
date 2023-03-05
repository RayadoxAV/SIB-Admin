import React from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../Clock/Clock';

interface HeaderProps {
  title: string;
  backButtonRoute: string;
};

const Header: React.FC<HeaderProps> = ({ title, backButtonRoute }) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(backButtonRoute);
  }

  return (
    <div className='c-header'>
      <button className='back-button fade-in-up' onClick={handleClick}>
        <i className='fa-solid fa-arrow-left'></i>
      </button>
      <Clock className='fade-in-up'/>
      <span className='title fade-in-up'>{title}</span>
    </div>
  );
};

export default Header;
