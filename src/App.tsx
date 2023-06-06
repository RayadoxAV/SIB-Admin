import React, { useContext, useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';
import { SERVER_IP } from './util/util';

import { appWindow } from '@tauri-apps/api/window';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from './components/loading-indicator/LoadingIndicator';
import NoServerError from './components/no-server-error/NoServerError';
import { AppContext } from './State';
import { applySetting } from './misc/settings/SettingsDispatcher';

import './main.css';
import './App.css';
import PrintingSettingsDispatcher from './misc/settings/PrintingSettingsDispatcher';
import { socket } from './socket/Socket';

function App() {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
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
      PrintingSettingsDispatcher.setupFlags();
      setLoading(true);

    }


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

      fetch(`${SERVER_IP}/validate_user_token`, requestOptions).then((res) => res.json()).then(async (response) => {
        if (response) {
          if (!response.isTokenValid) {
            // Redirigir al login
            setRedirect(true);
          } else {
            // Si los objetos no han sido consultados, consultarlos
            if (appContext.students.length < 1) {
              try {
                const options = {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                };

                const responseStudents = (await fetch(`${SERVER_IP}/students`, options).then((res) => res.json())).result;
                const responseControls = (await fetch(`${SERVER_IP}/controls`, options).then((res) => res.json())).result;
                const responseDocuments = (await fetch(`${SERVER_IP}/documents`, options).then((res) => res.json())).result;
                const responseUsers = (await fetch(`${SERVER_IP}/users`, options).then((res) => res.json())).result;

                dispatch({ type: 'setStudents', students: responseStudents });
                dispatch({ type: 'setControls', controls: responseControls });
                dispatch({ type: 'setDocuments', documents: responseDocuments });
                dispatch({ type: 'setUsers', users: responseUsers });
                setLoading(false);

                socket.on('add-element', (args: any) => {
                  onAddElement(args.type, args.list);
                });
                socket.on('update-element', (args: any) => {
                  onAddElement(args.type, args.list);
                });
                socket.on('remove-element', (args: any) => {
                  onAddElement(args.type, args.list);

                });
                socket.on('remove-elements', (args: any) => {

                });

              } catch (error: any) {
                console.log(error);
              }
            }
          }
        }
      }).catch((error) => {
        // Redirigir a la pantalla que indica que no hay un servidor disponible
        setLoading(false);
        setRedirectError(true);
      });

    }
  }, []);

  function onAddElement(type: number, list: any[]) {
    switch (type) {
      case 0:
        dispatch({ type: 'setStudents', students: list });
        break;

      case 1:
        dispatch({ type: 'setControls', controls: list });
        break;

      case 2:
        dispatch({ type: 'setDocuments', documents: list });
        break;

      case 3:
        dispatch({ type: 'setUsers', users: list });
        break;

      default:
        break;
    }
  }

  function onUpdateElement(type: any, list: any) {
    // switch (type) {
    //   case 0: {
    //     console.log(appContext);
    //     d
    //     // const list = [...appContext.students];
    //     // console.log(list, appContext);
    //     // list[index] = element;
    //     // console.log(list);
    //     // dispatch({ type: 'setStudents', documents: list });
    //   }
    //   break;

    //   case 1:{
    //     const list = [...appContext.controls];
    //     list[index] = element;
    //     // dispatch({ type: 'setControls', documents: list });
    //   }
    //   break;

    //   case 2: {
    //     const list = [...appContext.documents];
    //     list[index] = element;
    //     // dispatch({ type: 'setDocuments', documents: list });
    //   }
    //   break;

    //   case 3: {
    //     const list = [...appContext.users];
    //     list[index] = element;
    //     // dispatch({ type: 'setUsers', documents: list });
    //   }
    //   break;

    //   default:
    //   break;
    // }
  }

  function onRemoveElement() {

  }

  function onRemoveElements() {

  }

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
        <div className='main-container'>
          <NoServerError />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='App'>
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
      <div className='main-container' onScroll={handleScroll}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
