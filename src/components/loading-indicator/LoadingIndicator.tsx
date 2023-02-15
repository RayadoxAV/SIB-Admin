import React from 'react';

import './LoadingIndicator.css';

const LoadingIndicator: React.FC = () => {
  return (
    <div className='loading-indicator'>
      <div className='spinner'></div>
      <span className='loading-text'>Cargando</span>
    </div>
  )
};

export default LoadingIndicator;
