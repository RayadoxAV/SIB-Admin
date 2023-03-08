import React, { useContext, useEffect, useRef, useState } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Clock from '../../components/Clock/Clock';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import PopupMenu from '../../components/popup-menu/PopupMenu';
import Dialog from '../../components/Dialog/Dialog';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';

import './Student.css';
import { formatDate, formatoEscolaridad, formatoEstadoCivil, format } from '../../util/util';
import Header from '../../components/Header/Header';
import { printStudent } from '../../util/printing';

const Student: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [student, setStudent] = useState(undefined as any);
  const [documents, setDocuments] = useState([] as any[]);
  const [grades, setGrades] = useState([] as any[]);

  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

        const tempDocuments = [];

        const tempGrades = [];

        for (let j = 0; j < appContext.documents.length; j++) {
          if (appContext.documents[i].idAlumno === tempStudent.id) {
            tempDocuments.push(appContext.documents[j]);

            if (appContext.documents[j].tipo === 1) {
              tempGrades.push(...appContext.documents[j].informacion);
            }
          }
        }

        setLoading(false);
        setDocuments(tempDocuments);
        setGrades(tempGrades);
        break;
      }
    }
  }, []);

  function handleClick() {
    setRedirect(true);
  }

  function addInformationOption(index: number) {
    switch (index) {
      case 0: {
        navigate(`/add-information/report/${id}`);
        break;
      }

      case 1: {
        navigate(`/add-information/grade/${id}`);
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
    // console.log('Generate page and print');
    printStudent(student, documents);
    // window.print();
  }

  if (redirect) {
    return (
      <Navigate to="/students" />
    );
  }

  if (redirectLogin) {
    return (
      <Navigate to="/login" />
    );
  }

  if (loading) {
    return (
      <div className='container'>
        <Header
          title='Estudiante'
          backButtonRoute='/students' />
        <div className='c-body'>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='container'>
        <Header
          title='Estudiante'
          backButtonRoute='/students' />
        <div className='c-body spaced'>
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
                  <span className='value'>{formatDate(student.fechaNac)}</span>
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
                </div>
                <div className='column'>
                  <span className='value'>{student.grado}</span>
                  <span className='value'>{student.grupo}</span>
                </div>
              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Reportes</span>
              </div>
              <div className='card-body'>
                {documents.map((document: any, index: number) => {
                  if (document.tipo === 0) {
                    return (
                      <div className='row' key={index}>
                        <div className='column'>
                          <span className='data-name'>Motivo</span>
                          <span className='data-name'>Profesor</span>
                          <span className='data-name'>Asignatura</span>
                          <span className='data-name'>Fecha</span>
                        </div>
                        <div className='column'>
                          <span className='value'>{document.informacion.motivoReporte}</span>
                          <span className='value'>{document.informacion.profesor}</span>
                          <span className='value'>{document.informacion.asignatura}</span>
                          <span className='value'>{formatDate(document.fecha)}</span>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Calificaciones</span>
              </div>
              <div className='card-body'>
                {/* {grades.map((grade: any, index: number) => {
                    const data: JSX.Element[] = [];
                    const values: JSX.Element[] = [];

                    for (let i = 0; i < document.informacion.length; i++) {
                      data.push(<span className='data-name' key={i}>{document.informacion[i].asignatura}</span>);
                      values.push(<span className='value' key={i}>{document.informacion[i].calificacion}</span>);
                    }

                    return <div className='row' key={index}>
                      <div className='column'>
                        {data}
                      </div>
                      <div className='column'>
                        {values}
                      </div>
                    </div>;
                  
                })} */}
                <div className='row'>
                  <div className='column'>
                    {
                      grades.map((grade: any, index: number) => {
                        return (
                          <span key={index} className='data-name'>{grade.asignatura}</span>
                        );
                      })
                    }
                  </div>
                  <div className='column'>
                    {
                      grades.map((grade: any, index: number) => {
                        return (
                          <span key={index} className='value'>{grade.calificacion}</span>
                        );
                      })
                    }
                  </div>
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
            <div className='card-footer'>
            </div>
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
