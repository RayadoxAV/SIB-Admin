import React from 'react';

import './SelectionActionCenter.css';

interface SelectionActionCenterProps {
  className?: string;
  selectionQuantity: number;
  handleClose: Function;
  onEdit?: Function;
  onDelete: Function;
  editable?: boolean;
};

const SelectionActionCenter: React.FC<SelectionActionCenterProps> = ({ className, selectionQuantity, handleClose, onEdit, onDelete, editable = false }) => {

  const styleExpression = {
    transform: selectionQuantity === 0 ? 'translateY(100px)' : 'translate(0px)',
    opacity: selectionQuantity === 0 ? '0' : '1'
  };

  function handleEdit() {
    if (onEdit) {
      onEdit();
    }
  }

  function handleDelete() {
    onDelete();
    handleClose();
  }

  return (
    <div className={`selection-action-center ${className}`} style={styleExpression} >
      <button className='close-button' onClick={() => { handleClose(); }}><i className='fa-solid fa-close'></i></button>
      <span className='information'>
        <span className='pill'>{selectionQuantity}</span>
        <span className='text'>Elementos seleccionados</span>
      </span>
      <div className='actions'>
        <button className={`action ${editable ? '' : 'inactive'}`} disabled={!editable} onClick={handleEdit}><i className='fa-solid fa-pencil'></i> Editar</button>
        <button className='action delete' onClick={handleDelete}><i className='fa-solid fa-trash'></i> Eliminar</button>
      </div>
    </div>
  );
};

export default SelectionActionCenter;
