import React from 'react';
import { useNavigate } from 'react-router-dom';

import './NotFound.css';

const NotFound: React.FC = () => {

  const navigate = useNavigate();

  function handleClick() {
    navigate('/', { replace: true });
  }

  return (
    <div className='not-found fade-in-up'>
      <span className='title'>Ha habido un error</span>
      <p>El componente ha fallado</p>
      <button className='button-primary' onClick={handleClick}>Regresar</button>
    </div>
  );
};

export default NotFound;
