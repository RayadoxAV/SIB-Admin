import React from 'react';
import Header from '../../components/Header/Header';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

import './Actions.css';
import ActionItem from './ActionItem';

const Actions: React.FC = () => {
  return (
    <div className='container'>
      <Header
        title='Acciones'
        backButtonRoute='/' />
      <Breadcrumb
        crumbs={['Inicio', 'Acciones']}
        routes={['/', 'actions']} />
      <div className='c-body'>
        <div className='section'>
          <div className='section-header'>
            <span className='section-title'>Principales</span>
          </div>
          <div className='section-body'>
            <ActionItem icon='fa-clock' title='Promover de año' onClick={() => { }} />
            <ActionItem icon='fa-clipboard-question' title='Borrar estudios socioeconómicos' onClick={() => { }} />
            <ActionItem icon='fa-money-check' title='Borrar reportes' onClick={() => { }} />
            <ActionItem icon='fa-calculator' title='Borrar calificaciones' onClick={() => { }} />
            <ActionItem icon='fa-pizza-slice' title='Vaciar control de becas alimenticias' onClick={() => { }} />
            <ActionItem icon='fa-virus' title='Vaciar control de enfermos' onClick={() => { }} />
            <ActionItem icon='fa-glasses' title='Vaciar ver bien para aprender mejor' onClick={() => { }} />
            <ActionItem icon='fa-hands-holding-child' title='Vaciar situación especial' onClick={() => { }} />
            <ActionItem icon='fa-key' title='Cambiar código de acceso a plataforma' onClick={() => { }} />
          </div>
        </div>
        <div className='section'>
          <div className='section-header'>
            <span className='section-title'>Irreversibles</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--error-color)', userSelect: 'none' }}>Atención: Estas acciones son irreversibles y podrían eliminar todos los datos del sistema. Utilícese bajo precaución</span>
          </div>
          <div className='section-body'>
            <ActionItem icon='fa-rotate-left' title='Volver a configuración por defecto' onClick={() => { }} />
            <ActionItem icon='fa-address-card' title='Borrar todos los alumnos' onClick={() => { }} />
            <ActionItem icon='fa-trash' title='Borrado total' onClick={() => { }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
