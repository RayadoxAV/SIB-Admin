import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './NoServerError.css';

const NoServerError: React.FC = () => {
  
  const navigate = useNavigate();

  function handleClick() {
    navigate(0);
  }

  return (
    <div className='error-container'>
      <i className='error-icon fa-solid fa-triangle-exclamation fade-in-up'></i>
      <span className='header fade-in-up delay-1' style={{ opacity: '0' }}>Ha habido un error</span>
      <span className='text fade-in-up delay-3' style={{ opacity: '0' }}>El sistema ha encontrado un error al conectarse al servidor y no puede continuar</span>
      <span className='info fade-in-up delay-3' style={{ opacity: '0' }}>Si el problema persiste, póngase en contacto con soporte técnico</span>
      <button className='button-primary fade-in-up delay-3' style={{ marginTop: '1rem', opacity: '0' }} onClick={handleClick}>Reintentar</button>
    </div>
  );
};

export default NoServerError;
