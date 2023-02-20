import React, { MouseEventHandler, ReactNode, useState } from 'react';

import './Dialog.css';

interface DialogProps {
  title: string;
  prompt?: boolean;
  closable?: boolean;
  dismisable?: boolean;
  onConfirm?: Function;
  onClose?: Function
  onCancel?: Function;
  onDismiss?: Function;
  visible: boolean;
};

type DialogPropsWithChildren<DialogProps> = DialogProps & { children?: ReactNode }

const Dialog: React.FC<DialogPropsWithChildren<DialogProps>> = ({ title, prompt, closable = true, dismisable = true, onConfirm, onClose, onCancel, onDismiss, visible, children }) => {

  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
  }

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
  }

  function handleDismiss(event: any) {
    if (dismisable && event.target.id === 'dialog-container') {
      if (onDismiss) {
        onDismiss();
      } else {
        if (onClose) {
          onClose();
        }
      }
    }
  }

  return (
    <div id='dialog-container' className={`dialog-container ${visible ? 'active' : ''}`} onClick={handleDismiss}>
      <div className={`dialog delay-3 ${visible ? 'slide-in-up' : 'slide-out-down'}`}>
        <div className='dialog-header'>
          <span className='title'>{title}</span>
          {closable ?
            (
              <button className='close' onClick={handleClose}><i className='fa-solid fa-close'></i></button>
            ) :
            (
              null
            )}
        </div>
        <div className='dialog-body'>
          {children}
        </div>
        {prompt ?
          (
            <div className='dialog-prompt'>
              <button className='button-filled' onClick={handleCancel}>Cancelar</button>
              <button className='button-primary' onClick={handleConfirm}>Aceptar</button>
            </div>
          ) :
          (
            null
          )}
      </div>
    </div>
  );
}

export default Dialog;
