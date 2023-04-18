import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {

  const navigate = useNavigate();

  function handleClick() {
    navigate('/', { replace: true });
  }

  return (
    <div className='not-found'>
      <span className='title'>No encontrado</span>
      <button onClick={handleClick}>Regresar</button>
    </div>
  );
};

export default NotFound;
