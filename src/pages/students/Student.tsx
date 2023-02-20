import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Clock from '../../components/Clock/Clock';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import PopupMenu from '../../components/popup-menu/PopupMenu';
import Dialog from '../../components/Dialog/Dialog';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';

import './Student.css';

const Student: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);
  const [student, setStudent] = useState(undefined as any);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);

  const addInformationButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoading(true);
    dispatch({ type: 'setTitle', title: 'SI Estudiante' });
    const students = appContext.students;



    for (let i = 0; i < students.length; i++) {
      const tempStudent = students[i];

      if (tempStudent.id == id) {
        setStudent(tempStudent);
        setLoading(false);
        break;
      }
    }
  }, []);

  function handleClick() {
    setRedirect(true);
  }

  function format(type: any): string {
    switch (type) {
      case 'pequena':
        return 'Pequeña';
      case 'numerosa':
        return 'Numerosa';
      case 'mixta':
        return 'Mixta';
      case 'integrada':
        return 'Integrada';
      case 'desintegrada':
        return 'Desintegrada';
      case 'ladrillo':
        return 'Ladrillo';
      case 'adobe':
        return 'Adobe';
      case 'block':
        return 'Block';
      case 'madera':
        return 'Madera';
      case 'propia':
        return 'Propia';
      case 'rentada':
        return 'Rentada';
      case 'prestada':
        return 'Prestada';
      case 'pagandose':
        return 'Pagándose';
    }

    return '';
  }

  function formatoEstadoCivil(estadoCivil: string): string {
    switch (estadoCivil) {
      case '0':
        return 'Soltero(a)';
      case '1':
        return 'Casado(a)';
      case '2':
        return 'Unión libre';
    }
    return '';
  }
  function formatoEscolaridad(escolaridad: string): string {
    switch (escolaridad) {
      case '0':
        return 'Primaria';
      case '1':
        return 'Secundaria';
      case '2':
        return 'Bachillerato';
      case '3':
        return 'Licenciatura';
      case '4':
        return 'Posgrado';
    }
    return '';
  }
  
  function addInformationOption(index: number) {
    switch (index) {
      case 0: {
        alert('Reporte');
        break;
      }
      
      case 1: {
        alert('Calificaciones');
        break;
      }
      
      case 2: {
        alert('Otra cosa');
        break;
      }
      
      default: {
        console.log('Bad index');
      }
    }
  }

  function print() {
    window.print();
  }

  if (redirect) {
    return (
      <Navigate to="/students" />
    )
  }

  if (loading) {
    return (
      <div className='container'>
        <div className='c-header'>
          <button className='back-button fade-in-up' onClick={handleClick}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
          <Clock className='fade-in-up' />
          <span className='title fade-in-up'>Estudiante</span>
        </div>
        <div className='c-body'>
          <LoadingIndicator />
        </div>
      </div>
    );
  }


  return (
    <>
      <div className='container'>
        <div className='c-header'>
          <button className='back-button fade-in-up' onClick={handleClick}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
          <Clock className='fade-in-up' />
          <span className='title fade-in-up'>Estudiante</span>
        </div>
        <div className='c-body'>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
              <span className='name fade-in-up delay-3'>{student.nombre}</span>
              <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
            </div>
            <div className='actions-container'>
              <button ref={addInformationButton} className='action fade-in-up' onClick={() => { setDialogVisible(true); }}><i className='fa-solid fa-add'></i></button>
              <button className='action fade-in-up'><i className='fa-solid fa-pencil'></i> <span className='text'>Editar</span></button>
              <button className='action fade-in-up' onClick={print}><i className='fa-solid fa-print'></i> <span className='text'>Imprimir</span></button>
            </div>
          </div>
          <div className='information-container fade-in-up delay-3'>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Información personal</span>
              </div>
              <div className='card-body'>
                <div className='column'>
                  <span className='data-name'>CURP</span>
                  <span className='data-name'>Fecha de nacimiento</span>
                  <span className='data-name'>Dirección</span>
                  <span className='data-name'>Teléfono</span>
                </div>
                <div className='column'>
                  <span className='value'>{student.CURP}</span>
                  <span className='value'>{student.fechaNac.split('T')[0].replace(/-/g, '/')}</span>
                  <span className='value'>{student.direccion}, {student.colonia}, {student.localidad}</span>
                  <span className='value'>{student.telefono}</span>
                </div>
              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Información escolar</span>
              </div>
              <div className='card-body'>
                <div className='column'>
                  <span className='data-name'>Grado</span>
                  <span className='data-name'>Grupo</span>
                  <span className='data-name'>Calificaciones</span>
                </div>
                <div className='column'>
                  <span className='value'>{student.grado}</span>
                  <span className='value'>{student.grupo}</span>
                  <span className='value'>{student.promedio}</span>
                </div>
              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Información familiar</span>
              </div>
              <div className='card-body'>
                <div className='vertical-container'>
                  {student.miembrosFamilia.map((miembro: any, index: number) => (
                    <div className='row' key={index}>
                      <div className='column'>
                        <span className='data-name'>{miembro.nombreMiembro}</span>
                        <span className='data-name'>Parentesco</span>
                        <span className='data-name'>Edad</span>
                        <span className='data-name'>Estado civil</span>
                        <span className='data-name'>Escolaridad</span>
                        <span className='data-name'>Ocupación</span>
                      </div>
                      <div className='column'>
                        <span className='value'>&nbsp;</span>
                        <span className='value'>{miembro.parentescoMiembro}</span>
                        <span className='value'>{miembro.edadMiembro} años</span>
                        <span className='value'>{formatoEstadoCivil(miembro.estadoCivilMiembro)}</span>
                        <span className='value'>{formatoEscolaridad(miembro.escolaridadMiembro)}</span>
                        <span className='value'>{miembro.ocupacionMiembro}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Tipo de familia</span>
              </div>
              <div className='card-body'>
                <div className='column'>
                  <span className='data-name'>Tamaño de familia</span>
                  <span className='data-name'>Tipo de familia</span>
                  <span className='data-name'>Cantidad de miembros</span>
                  <span className='data-name'>Cantidad de miembros que trabajan</span>
                </div>
                <div className='column'>
                  <span className='value'>{format(student.cantidadMiembros)}</span>
                  <span className='value'>{format(student.tipoFamilia)}</span>
                  <span className='value'>{student.miembrosFamilia.length + 1}</span>
                  <span className='value'>{student.totalMiembrosTrabajan}</span>
                </div>
              </div>
              <div className='card-footer'></div>
            </div>
          </div>
          <div className='card fade-in-up delay-3' style={{ marginTop: '1rem', opacity: '0' }}>
            <div className='card-header'>
              <span className='card-title'>Información socioeconómica</span>
            </div>
            <div className='card-body'>
              <div className='column'>
                <span className='data-name'>Egresos familiares</span>
                <span className='data-name'>Alimentación</span>
                <span className='data-name'>Medicamentos</span>
                <span className='data-name'>Transporte</span>
                <span className='data-name'>Gasolina</span>
                <span className='data-name'>Educación</span>
                <span className='data-name'>Abono</span>
                <span className='data-name'>Celulares</span>
                <span className='data-name'>Servicio médico</span>
                <span className='data-name'>Guardería</span>
              </div>
              <div className='column'>
                <span className='value'>&nbsp;</span>
                <span className='value'>${student.alimentacion}</span>
                <span className='value'>${student.medicamentos}</span>
                <span className='value'>${student.transporte}</span>
                <span className='value'>${student.gasolina}</span>
                <span className='value'>${student.educacion}</span>
                <span className='value'>${student.abono}</span>
                <span className='value'>${student.celulares}</span>
                <span className='value'>${student.servicioMedico}</span>
                <span className='value'>${student.guarderia}</span>
              </div>
              <div className='column'>
                <span className='data-name'>&nbsp;</span>
                <span className='data-name'>Agua</span>
                <span className='data-name'>Gas cilíndro</span>
                <span className='data-name'>Energía eléctrica</span>
                <span className='data-name'>Teléfono / Internet</span>
                <span className='data-name'>Cable</span>
                <span className='data-name'>Otros</span>
                <span className='data-name'>Total de egresos</span>
                <span className='data-name'>Material de la vivienda</span>
                <span className='data-name'>Estado de la vivienda</span>
              </div>
              <div className='column'>
                <span className='value'>&nbsp;</span>
                <span className='value'>${student.agua}</span>
                <span className='value'>${student.gasCilindro}</span>
                <span className='value'>${student.energiaElectrica}</span>
                <span className='value'>${student.telefonoInternet}</span>
                <span className='value'>${student.cable}</span>
                <span className='value'>${student.otros}</span>
                <span className='value'>${student.totalEgresos}</span>
                <span className='value'>{format(student.materialVivienda)}</span>
                <span className='value'>{format(student.estadoVivienda)}</span>
              </div>
            </div>
            <div className='card-footer'></div>
          </div>
        </div>
      </div>
      <Dialog
        visible={dialogVisible}
        title='Agregar información'
        closable={true}
        onConfirm={() => { setDialogVisible(false); }}
        onClose={() => { setDialogVisible(false); }}
        onCancel={() => { setDialogVisible(false); }}
        prompt={false}>
          <button className='option-button' onClick={() => { addInformationOption(0); }}>Reporte</button>
          <button className='option-button' onClick={() => { addInformationOption(1); }}>Calificaciones</button>
          <button className='option-button' onClick={() => { addInformationOption(2); }}>Otra cosa</button>
        </Dialog>
    </>
  );
};

export default Student;
