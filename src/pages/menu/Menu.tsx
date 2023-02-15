import React, { useContext, useEffect } from 'react';
import Clock from '../../components/Clock/Clock';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';
import { SERVER_IP } from '../../util/util';

import './Menu.css';
import MenuItem from './MenuItem';

const Menu: React.FC = () => {
  const [_, dispatch] = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: 'setTitle', title: 'SI Inicio' });
  }, []);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const requestOptions = {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // };

    // fetch(`${SERVER_IP}/students`, requestOptions).then((res) => res.json()).then((response) => {
    //   if (response) {
    //     if (response.queryStatusCode === 0) {
    //       alert(JSON.stringify(response));
    //     }
    //   }
    // });

  }, []);


  return (
    <div className='menu'>
      <div className='menu-header'>
        <Clock className="fade-in-up" />
        <span className='header fade-in-up'>Bienvenido</span>
      </div>
      <div className='item-container'>
        <MenuItem className="scale-in" text="Inicio" icon="fa-home" route="/" />
        <MenuItem className="scale-in delay-1" text="Estudiantes" icon="fa-graduation-cap" route="/students" />
        <MenuItem className="scale-in delay-3" text="Usuarios" icon="fa-users" route="/users" />
        <MenuItem className="scale-in delay-5" text="Estudios socioeconómicos" icon="fa-dollar-sign" route="" />
        <MenuItem className="scale-in delay-7" text="Reportes" icon="fa-chart-line" route="" />
        <MenuItem className="scale-in delay-9" text="Configuración" icon="fa-gear" route="/settings" />
      </div>
    </div>
  );
};

export default Menu;
