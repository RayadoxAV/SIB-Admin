import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

import './Actions.css';
import ActionItem from './ActionItem';
import { SERVER_IP } from '../../util/util';
import Dialog from '../../components/Dialog/Dialog';

const Actions: React.FC = () => {

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  function executeAction(action: string, ...args: string[]) {
    if (args.length > 0) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(args),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        
      };

      fetch(`${SERVER_IP}/${action}`, requestOptions).then((res) => res.json()).then((response) => {
        if (response.actionStatusCode === 0) {
          setSuccessDialogVisible(true);
        } else {
          alert('Ha habido un error. Inténtelo de nuevo más tarde');
        }
      }).catch((error) => {
        alert('Ha habido un error. Inténtelo de nuevo más tarde');
      });

    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      fetch(`${SERVER_IP}/${action}`, requestOptions).then((res) => res.json()).then((response) => {
        if (response.actionStatusCode === 0) {
          setSuccessDialogVisible(true);
        } else {
          alert('Ha habido un error. Inténtelo de nuevo más tarde');
        }
      }).catch((error) => {
        alert('Ha habido un error. Inténtelo de nuevo más tarde');
      });
    }
  }

  async function confirmAction(action: string, ...args: string[]) {
    const response = await confirm('¿Está seguro de que desea realizar esta acción?');

    if (response) {
      executeAction(action, ...args);
    }
  }

  async function inputAction(action: string, ...args: string[]) {
    const response = await prompt('Ingrese el nuevo valor');

    console.log(response);
    if (response) {
      executeAction(action, response);
    }
  }

  async function dangerousAction(action: string) {
    const confirmAction = await confirm('¿Está seguro de que desea realizar esta acción?');

    if (confirmAction) {
      const input = await prompt(`Para continuar introduzca el siguiente texto en la caja ${action}`);

      if (input === action) {
        executeAction(action);
      } else {
        alert('Se ha cancelado la acción');
      }
    }
  }

  return (
    <>
      <div className='container'>
        <Header
          title='Acciones'
          backButtonRoute='/' />
        <Breadcrumb
          crumbs={['Inicio', 'Acciones']}
          routes={['/', 'actions']} />
        <div className='c-body'>
          <div className='section fade-in-up delay-3' style={{ opacity: '0' }}>
            <div className='section-header'>
              <span className='section-title'>Principales</span>
            </div>
            <div className='section-body'>
              <ActionItem icon='fa-clock' title='Promover de año' onClick={() => { confirmAction('promote_all') }} />
              {/* <ActionItem icon='fa-clipboard-question' title='Borrar estudios socioeconómicos' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-money-check' title='Borrar reportes' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-calculator' title='Borrar calificaciones' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-pizza-slice' title='Vaciar control de becas alimenticias' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-virus' title='Vaciar control de enfermos' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-glasses' title='Vaciar ver bien para aprender mejor' onClick={() => { }} /> */}
              {/* <ActionItem icon='fa-hands-holding-child' title='Vaciar situación especial' onClick={() => { }} /> */}
              <ActionItem icon='fa-key' title='Cambiar código de acceso a plataforma' onClick={() => { inputAction('change_code') }} />
            </div>
          </div>
          <div className='section fade-in-up delay-5' style={{ opacity: '0' }}>
            <div className='section-header'>
              <span className='section-title'>Irreversibles</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--error-color)', userSelect: 'none' }}>Atención: Estas acciones son irreversibles y podrían eliminar todos los datos del sistema. Utilícese bajo precaución</span>
            </div>
            <div className='section-body'>
              <ActionItem dangerous={true} icon='fa-address-card' title='Borrar todos los alumnos' onClick={() => { dangerousAction('delete_students') }} />
              {/* <ActionItem dangerous={true} icon='fa-trash' title='Borrado total' onClick={() => { dangerousAction('system_wipe') }} /> */}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        visible={successDialogVisible}
        title='Acción realizada'
        closable={true}
        onConfirm={() => { setSuccessDialogVisible(false); }}
        onClose={() => { setSuccessDialogVisible(false); }}
        onCancel={() => { setSuccessDialogVisible(false); }}
        prompt={true}>
        Acción realizada correctamente
      </Dialog>
    </>
  );
};

export default Actions;
