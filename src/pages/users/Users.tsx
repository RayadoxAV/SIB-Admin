import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Clock from '../../components/Clock/Clock';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Table from '../../components/table/Table';
import { useDate } from '../../hooks/useDate';
import { AppContext, AppContextProvider } from '../../State';
import { SERVER_IP } from '../../util/util';

const headers = [
  {
    name: 'idUsuario',
    displayName: 'id'
  },
  {
    name: 'nombreUsuario',
    displayName: 'Nombre de usuario'
  },
  {
    name: 'nombre',
    displayName: 'Nombre'
  },
  {
    name: 'role',
    displayName: 'Rol'
  },
  {
    name: 'estado',
    displayName: 'Estado'
  }
];


const Users: React.FC = () => {
  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    dispatch({ type: 'setTitle', title: 'SI Usuarios' });

    if (appContext.users.length === 0) {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setRedirectLogin(true);
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      fetch(`${SERVER_IP}/users`, requestOptions).then((res) => (res.json())).then((response) => {
        if (response.queryStatusCode === 0) {
          const queryUsers = response.result;

          for (let i = 0; i < queryUsers.length; i++) {
            const user = queryUsers[i];
            user.nombre = `${user.nombres} ${user.pApellido} ${user.sApellido}`;
          }

          dispatch({ type: 'setUsers', users: queryUsers });
          setUsers(queryUsers);
          setLoading(false);
        } else if (response.queryStatusCode === 1) {
          console.log('Manejar el error');
        }
      }).catch((error) => {
        console.log('Manejar el error');
      });

    } else {
      setLoading(false);
      setUsers(appContext.users);
    }
  }, []);

  function handleClick() {
    setRedirect(true);
  }

  if (redirect) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <div className='container'>
      <div className='c-header'>
        <button className='back-button fade-in-right' onClick={handleClick}>
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        <Clock className='fade-in-right delay-3' />
        <span className='title fade-in-right delay-3'>Usuarios</span>
      </div>
      <div className='c-body'>
        {
          loading ?
            (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <LoadingIndicator />
              </div>
            ) :
            (
              <Table
                headers={headers}
                data={users}
                selectable={true}
                searchable={true}
                searchParams={['idUsuario', 'nombreUsuario', 'nombre', 'role:', 'estado:']}
              />
            )
        }
      </div>
      <div className='c-footer'></div>
    </div>
  );
};

export default Users;
