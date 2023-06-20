import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../../components/Clock/Clock';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';
import { SERVER_IP } from '../../util/util';

import './Menu.css';
import MenuItem from './MenuItem';

const Menu: React.FC = () => {
  const [_, dispatch] = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    // Especificar el título de la ventana
    dispatch({ type: 'setTitle', title: 'SI Inicio' });
  }, []);

  // Función para manejar el clic en el botón de "Cerrar sesión" y redirigir al Login
  async function handleLogout() {
    const result = await confirm('¿Está seguro que desea cerrar sesión?');
    if (result) {
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className='menu'>
      <div className='menu-header'>
        <Clock className='fade-in-up' />
        <span className='header fade-in-up'>Bienvenido</span>
        <button className='log-out' onClick={handleLogout}><i className='fa-solid fa-sign-out'></i></button>
      </div>
      <div className='item-container'>
        <MenuItem className='scale-in' text='Controles' icon='fa-folder-tree' route='/controls' />
        <MenuItem className='scale-in delay-1' text='Estudiantes' icon='fa-graduation-cap' route='/students' />
        <MenuItem className='scale-in delay-3' text='Usuarios' icon='fa-users' route='/users' />
        <MenuItem className='scale-in delay-5' text='Acciones' icon='fa-diagram-successor' route='/actions' />
        {/* <MenuItem className='scale-in delay-7' text='Reportes' icon='fa-chart-line' route='/reports' /> */}
        <MenuItem className='scale-in delay-9' text='Configuración' icon='fa-gears' route='/settings' />
      </div>
    </div>
  );
};

export default Menu;
