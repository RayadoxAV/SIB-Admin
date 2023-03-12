import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import TitleBar from './components/title-bar/TitleBar';

import { SERVER_IP } from './util/util';

import './main.css';
import './App.css';

import { appWindow } from '@tauri-apps/api/window';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from './components/loading-indicator/LoadingIndicator';
import NoServerError from './components/no-server-error/NoServerError';
import { AppContext } from './State';
import { applySetting } from './misc/SettingsDispatcher';

function App() {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [redirectError, setRedirectError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Función para agregar una clase al header cuando se hace scroll
  function handleScroll(event: any) {
    if (event.target.scrollTop > 20) {
      document.getElementsByClassName('c-header')[0]?.classList.add('scrolled');
    } else {
      document.getElementsByClassName('c-header')[0]?.classList.remove('scrolled');
    }
  }

  useEffect(() => {

    // Si no existen las configuraciones, cargarlas en el state a partir del globalThis
    if (!appContext.settings.categories) {
      dispatch({ type: 'setSettings', settings: globalThis.settings });
    }

    setLoading(true);

    // Validar el token del usuario para confirmar su identidad de ser necesario
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      fetch(`${SERVER_IP}/validate_user_token`, requestOptions).then((res) => res.json()).then((response) => {
        setLoading(false);
        if (response) {
          if (!response.isTokenValid) {
            // Redirigir al login
            setRedirect(true);
          } else {
            appWindow.setResizable(true);
          }
        }
      }).catch((error) => {
        // Redirigir a la pantalla que indica que no hay un servidor disponible
        setLoading(false);
        setRedirectError(true);
      });

    }
  }, []);

  // Aplicar las configuraciones reaccionando al cambio de estado de las configuraciones
  useEffect(() => {
    if (appContext.changedSetting.settingName) {
      const changedSetting = appContext.changedSetting;
      applySetting(changedSetting);
    }
  }, [appContext.settings]);

  if (!localStorage.getItem('token')) {
    return (
      <Navigate to="/login" replace={true} />
    );
  }

  if (redirect) {
    return (
      <Navigate to="/login" replace={true} />
    );
  }

  if (redirectError) {
    return (
      <div className='App'>
        <TitleBar title={'SI Error'} />
        <div className='main-container'>
          <NoServerError />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='App'>
        <TitleBar title={'SI'} />
        <div className='main-container'>
          <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: '0.5rem', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingIndicator />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <TitleBar title={'SI'} />
      <div className='main-container' onScroll={handleScroll}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
