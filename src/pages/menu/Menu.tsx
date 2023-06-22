import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../../components/Clock/Clock';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';
import { SERVER_IP } from '../../util/util';

import './Menu.css';
import MenuItem from './MenuItem';

const Menu: React.FC = () => {
  const [_, dispatch] = useContext(AppContext);

  const [username, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Especificar el título de la ventana
    dispatch({ type: 'setTitle', title: 'SI Inicio' });
    const user = JSON.parse(localStorage.getItem('user')!!);
    const tempUserName = `${user.nombres} ${user.pApellido} ${user.sApellido}`;
    setUserName(tempUserName);
  }, []);

  // Función para manejar el clic en el botón de "Cerrar sesión" y redirigir al Login
  async function handleLogout() {
    const result = await confirm('¿Está seguro que desea cerrar sesión?');
    if (result) {
      localStorage.clear();
      dispatch({ type: 'clean'});
      navigate('/login', { replace: true });
      console.log(_);
    }
  }

  return (
    <div className='menu'>
      <div className='menu-header'>
        <Clock className='fade-in-up' />
        <span className='header fade-in-up'>Bienvenido</span>
        <span className='user-name fade-in-up'>{username}</span>
        <button className='log-out fade-in-up' onClick={handleLogout}><i className='fa-solid fa-sign-out'></i></button>
      </div>
      <div className='item-container'>
        {/* <MenuItem className='scale-in' text='Controles' icon='fa-folder-tree' route='/controls' /> */}
        <MenuItem requiredRole={5} userRole={JSON.parse(localStorage.getItem('user')!!).role} className='scale-in delay-1' text='Estudiantes' icon='fa-graduation-cap' route='/students' />
        <MenuItem requiredRole={1} userRole={JSON.parse(localStorage.getItem('user')!!).role} className='scale-in delay-3' text='Usuarios' icon='fa-users' route='/users' />
        <MenuItem requiredRole={1} userRole={JSON.parse(localStorage.getItem('user')!!).role} className='scale-in delay-5' text='Acciones' icon='fa-diagram-successor' route='/actions' />
        {/* <MenuItem className='scale-in delay-7' text='Reportes' icon='fa-chart-line' route='/reports' /> */}
        <MenuItem requiredRole={5} userRole={JSON.parse(localStorage.getItem('user')!!).role} className='scale-in delay-9' text='Configuración' icon='fa-gears' route='/settings' />
      </div>
    </div>
  );
};

export default Menu;
