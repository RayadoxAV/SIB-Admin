import React, { useContext, useEffect, useRef, useState } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Dialog from '../../components/Dialog/Dialog';
import { AppContext } from '../../State';

import './Student.css';
import { formatDate, formatoEscolaridad, formatoEstadoCivil, format, SERVER_IP } from '../../util/util';
import Header from '../../components/Header/Header';
import { printStudent } from '../../util/printing';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

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

  const [isEditingReports, setEditingReports] = useState(false);
  const [isEditingGrades, setEditingGrades] = useState(false);

  useEffect(() => {
    setLoading(true);
    const students = appContext.students;

    for (let i = 0; i < students.length; i++) {
      const tempStudent = students[i];

      if (tempStudent.id == id) {
        setStudent(tempStudent);

        const tempDocuments = [];

        for (let j = 0; j < appContext.documents.length; j++) {
          if (appContext.documents[j].idAlumno === tempStudent.id) {
            tempDocuments.push(appContext.documents[j]);
          }
        }
        setDocuments(tempDocuments);
        setLoading(false);


        // generateGradeRows();
        // setGrades(tempGrades);
        break;
      }
    }
  }, [appContext.students, appContext.documents]);

  useEffect(() => {
    generateGradeRows();
  }, [appContext.documents, isEditingGrades]);


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
        navigate(`/add-information/estudioSoc/${id}`);
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

  function generateGradeRows() {

    const tempGrades = [];

    for (let i = 0; i < appContext.documents.length; i++) {
      const document = appContext.documents[i];

      if (document.tipo === 1) {
        for (let j = 0; j < document.informacion.length; j++) {
          const grade = document.informacion[j];
          const row =
            <div key={`${i}-${j}`} className='row grade-row'>
              <div className='column grade-center'>
                <span className='data-name'>{grade.asignatura}</span>
              </div>
              <div className='column grade-center'>
                <span className='value'>{grade.calificacion}</span>
              </div>
              <div className='column delete-column' style={{ maxWidth: isEditingGrades ? '3rem' : '0rem' }}>
                <button onClick={() => { deleteGrade(document.id) }}>
                  <i className='fa-solid fa-trash'></i>
                </button>
              </div>
            </div>;

          tempGrades.push(row);
        }
      }
    }
    // console.log(tempGrades);
    setGrades(tempGrades);

  }

  function deleteReport(id: number) {
    console.log(id);
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/document/${id}`, requestOptions).then((res) => res.json()).then((response: any) => {
      if (response.requestStatus === 'SUCCESS' && response.deletionStatusCode === 0) {
        alert('Reporte borrado exitosamente');
        setEditingReports(false);
      } else {
        alert('No se pudo borrar el reporte')
      }
    });
  }

  async function deleteGrade(id: number) {
    const answer = await confirm('¿Está seguro de que desea borrar la calificación? Borrará todas las calificaciones del documento');

    if (answer) {
      console.log(id);
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      fetch(`${SERVER_IP}/document/${id}`, requestOptions).then((res) => res.json()).then((response: any) => {
        if (response.requestStatus === 'SUCCESS' && response.deletionStatusCode === 0) {
          alert('Calificacion borrada exitosamente');
          setEditingGrades(false);
        } else {
          alert('No se pudo borrar la calificacion');
        }
      });
    }
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
        <Breadcrumb
          crumbs={['Inicio', 'Estudiantes', 'Estudiante']}
          routes={['/', '/students', '/student']} />
        <div className='c-body spaced'>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
              <span className='name fade-in-up delay-3'>{student.nombres} {student.pApellido} {student.sApellido}</span>
              <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
            </div>
            <div className='actions-container'>
              <button ref={addInformationButton} className='action fade-in-up' onClick={() => { setDialogVisible(true); }}><i className='fa-solid fa-add'></i></button>
              {
                JSON.parse(localStorage.getItem('user')!!).role < 3 ?
                  (
                    <button className='action fade-in-up' onClick={() => { navigate(`/edit-student/${student.id}`) }}><i className='fa-solid fa-pencil'></i> <span className='text'>Editar</span></button>
                  ) : null
              }
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
                  <span className='value'>{student.informacion.direccion}, {student.informacion.colonia}, {student.informacion.localidad}</span>
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
                  <span className='value'>{student.informacion.grado}</span>
                  <span className='value'>{student.informacion.grupo}</span>
                </div>
              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Reportes</span>
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                  <button className='card-button' onClick={() => {
                    const tempEditingReports = isEditingReports;
                    setEditingReports(!tempEditingReports);
                  }}>
                    <i className={`fa-solid ${isEditingReports ? 'fa-close' : 'fa-pencil'}`}></i>
                  </button>
                  <button className='card-button' onClick={() => {
                    navigate(`/student/reports/${id}`);
                  }}>
                    <i className='fa-solid fa-circle-info'></i>
                  </button>
                </div>
              </div>
              <div className='card-body col' style={{ padding: '0.25rem' }}>
                {
                  documents.reduce((accumulator: number, currentDocument: any) => {
                    if (currentDocument.tipo === 0) {
                      accumulator += 1;
                    }
                    return accumulator;
                  }, 0) === 0 ? (
                    <div className='card-content'>
                      Sin reportes registrados
                    </div>
                  ) : (
                    documents.map((document: any, index: number) => {
                      if (document.tipo === 0) {
                        return (
                          <div className='row report-row' key={index}>
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
                            <div className='column delete-column' style={{ maxWidth: isEditingReports ? '3rem' : '0rem' }}>
                              <button onClick={() => { deleteReport(document.id); }}>
                                <i className='fa-solid fa-trash'></i>
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  )
                }

              </div>
              <div className='card-footer'></div>
            </div>
            <div className='card'>
              <div className='card-header'>
                <span className='card-title'>Calificaciones</span>
                <div style={{ marginLeft: 'auto' }}>
                  <button className='card-button' onClick={() => {
                    const tempEditingGrades = isEditingGrades;
                    setEditingGrades(!tempEditingGrades);
                  }}>
                    <i className={`fa-solid ${isEditingGrades ? 'fa-close' : 'fa-pencil'}`}></i>
                  </button>
                </div>
              </div>
              <div className='card-body col' style={{ padding: '0.5rem' }}>
                {
                  documents.reduce((accumulator: number, currentDocument: any) => {
                    if (currentDocument.tipo === 1) {
                      accumulator += 1;
                    }
                    return accumulator;
                  }, 0) === 0 ? (
                    <div className='card-content'>
                      Sin calificaciones registradas
                    </div>
                  ) : (
                    grades
                  )
                }
              </div>
            </div>
            {student.informacion.estudioSoc.miembrosFamilia ?
              (
                <div className='card'>
                  <div className='card-header'>
                    <span className='card-title'>Información familiar</span>
                  </div>
                  <div className='card-body'>
                    <div className='vertical-container'>
                      {student.informacion.estudioSoc.miembrosFamilia.map((miembro: any, index: number) => (
                        <div className='row' key={index}>
                          <div className='column'>
                            <span className='data-name'>{miembro.nombreMiembro}</span>
                            <span className='data-name'>Parentesco</span>
                            <span className='data-name'>Edad</span>
                            <span className='data-name'>Estado civil</span>
                            <span className='data-name'>Escolaridad</span>
                            <span className='data-name'>Ocupación</span>
                            {miembro.empresaMiembro ?
                              (
                                <span className='data-name'>Empresa</span>
                              ) :
                              (null)}
                            <span className='data-name'>Ingreso mensual</span>
                            <span className='data-name'>Aporte al ingreso familiar</span>
                            {miembro.emergenciaMiembro ?
                              (
                                <span className='data-name emergency'>Contacto de emergencia</span>
                              ) :
                              (null)}
                          </div>
                          <div className='column'>
                            <span className='value'>&nbsp;</span>
                            <span className='value'>{miembro.parentescoMiembro}</span>
                            <span className='value'>{miembro.edadMiembro} años</span>
                            <span className='value'>{formatoEstadoCivil(miembro.estadoCivilMiembro)}</span>
                            <span className='value'>{formatoEscolaridad(miembro.escolaridadMiembro)}</span>
                            <span className='value'>{miembro.ocupacionMiembro}</span>
                            {miembro.empresaMiembro ?
                              (
                                <span className='value'>{miembro.empresaMiembro}</span>
                              ) :
                              (null)}
                            <span className='value'>${miembro.ingresoMiembro}</span>
                            <span className='value'>${miembro.aporteMiembro}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) :
              (null)}
            {
              student.informacion.estudioSoc.miembrosFamilia ?
                (
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
                        <span className='value'>{format(student.informacion.estudioSoc.cantidadMiembros)}</span>
                        <span className='value'>{format(student.informacion.estudioSoc.tipoFamilia)}</span>
                        <span className='value'>{student.informacion.estudioSoc.miembrosFamilia.length + 1}</span>
                        <span className='value'>{student.informacion.estudioSoc.totalMiembrosTrabajan}</span>
                      </div>
                    </div>
                    <div className='card-footer'></div>
                  </div>
                ) :
                (
                  null
                )
            }
          </div>
          {
            Object.entries(student.informacion.estudioSoc).length > 0 ?
              (
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
                      <span className='value'>${student.informacion.estudioSoc.alimentacion}</span>
                      <span className='value'>${student.informacion.estudioSoc.medicamentos}</span>
                      <span className='value'>${student.informacion.estudioSoc.transporte}</span>
                      <span className='value'>${student.informacion.estudioSoc.gasolina}</span>
                      <span className='value'>${student.informacion.estudioSoc.educacion}</span>
                      <span className='value'>${student.informacion.estudioSoc.abono}</span>
                      <span className='value'>${student.informacion.estudioSoc.celulares}</span>
                      <span className='value'>${student.informacion.estudioSoc.servicioMedico}</span>
                      <span className='value'>${student.informacion.estudioSoc.guarderia}</span>
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
                      <span className='value'>${student.informacion.estudioSoc.agua}</span>
                      <span className='value'>${student.informacion.estudioSoc.gasCilindro}</span>
                      <span className='value'>${student.informacion.estudioSoc.energiaElectrica}</span>
                      <span className='value'>${student.informacion.estudioSoc.telefonoInternet}</span>
                      <span className='value'>${student.informacion.estudioSoc.cable}</span>
                      <span className='value'>${student.informacion.estudioSoc.otros}</span>
                      <span className='value'>${student.informacion.estudioSoc.totalEgresos}</span>
                      <span className='value'>{format(student.informacion.estudioSoc.materialVivienda)}</span>
                      <span className='value'>{format(student.informacion.estudioSoc.estadoVivienda)}</span>
                    </div>
                  </div>
                  <div className='card-footer'>
                  </div>
                </div>
              ) :
              (
                null
              )
          }
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
        {
          Object.entries(student.informacion.estudioSoc).length > 0 ?
            (null) :
            (
              <button className='option-button' onClick={() => { addInformationOption(2); }}>Estudio socioeconómico</button>
            )
        }
      </Dialog>
    </>
  );
};

export default Student;
