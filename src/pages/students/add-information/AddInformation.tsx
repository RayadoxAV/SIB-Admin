import { Form, Formik } from 'formik';
import { title } from 'process';
import React, { useEffect, useState, useContext } from 'react';

import { Navigate, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';

import Clock from '../../../components/Clock/Clock';
import Dialog from '../../../components/Dialog/Dialog';
import FormError from '../../../components/form-error/FormError';
import Header from '../../../components/Header/Header';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import { useDate } from '../../../hooks/useDate';
import { AppContext } from '../../../State';
import { selectStyle } from '../../../util/reactSelectStyle';
import { SERVER_IP } from '../../../util/util';

import './AddInformation.css';
import { gradeInitialValues, gradeValidationSchema, GradeValues, reportInitialValues, reportPerformanceOptions, reportValidationSchema, ReportValues } from './InformationForms';

const AddInformation: React.FC = () => {

  const { type, id } = useParams();

  const [appContext, dispatch] = useContext(AppContext);

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(undefined as any);

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const [grades, setGrades] = useState([] as GradeValues[]);

  const date = useDate();

  useEffect(() => {
    setLoading(true);
    dispatch({ type: 'setTitle', title: `Agregar ${determineTitle(type)}` });

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

  function determineType(type: string | undefined): number {
    let typeNumber = -1;
    switch (type) {
      case 'report': {
        typeNumber = 0;
        break;
      }

      case 'grade': {
        typeNumber = 1;
        break;
      }

      default: {
        typeNumber = -1;
        break;
      }
    }

    return typeNumber;
  }

  function reportHandleSubmit(values: ReportValues, { resetForm }: any) {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({
        type: determineType(type),
        information: JSON.stringify({ ...values })
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/students/add-information/${id}`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Error al agregar la información. Inténtelo de nuevo más tarde.');
        return;
      }

      if (response.updateStatusCode === 1) {
        alert('Error al agregar la información. Datos inválidos.');
        return;
      }

      resetForm();
      setSuccessDialogVisible(true);
    });
  }

  function gradeHandleSubmit(grade: GradeValues, { resetForm }: any) {
    const tempGrades = [...grades];

    tempGrades.push(grade);

    setGrades(tempGrades);
    resetForm();
  }

  function determineTitle(type: string | undefined): string {
    let title = '';
    switch (type) {
      case 'report': {
        title = 'reporte';
        break;
      }

      case 'grade': {
        title = 'calificaciones';
        break;
      }

      default: {
        title = 'algo no anda bien';
        break;
      }
    }

    return title;
  }

  function deleteGrade(index: number) {
    const tempGrades = [...grades];
    tempGrades.splice(index, 1);
    setGrades(tempGrades);
  }

  function onSubmitFinalGrades() {
    if (grades.length > 0) {
      const requestOptions = {
        method: 'PUT',
        body: JSON.stringify({
          type: determineType(type),
          information: JSON.stringify(grades)
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      fetch(`${SERVER_IP}/students/add-information/${id}`, requestOptions).then((res) => res.json()).then((response) => {
        if (response.requestStatus === 'ERROR') {
          alert('Error al agregar la información. Inténtelo de nuevo más tarde.')
          return;
        }

        if (response.updateStatusCode === 1) {
          alert('Error al agregar la información. Datos inválidos.')
          return;
        }

        setGrades([]);
        setSuccessDialogVisible(true);
      })
    } else {
      alert('Agregue calificaciones para proceder');
    }
  }

  function determineLayout(type: string | undefined): JSX.Element {

    let layout;

    switch (type) {
      case 'report': {
        layout =
          <div className='report'>
            <div className='report-header'>
              <div className='identification'>
                <span className='name fade-in-up delay-3'>{student.nombre}</span>
                <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
                <div className='grado-grupo fade-in-up delay-5'>
                  <span className='grado'>Grado: {student.grado}°</span>
                  <span className='grupo'>{student.grupo}</span>
                </div>
              </div>
              <span className='date fade-in-up delay-3'>{date}</span>
            </div>
            <div className='report-body'>
              <Formik
                initialValues={reportInitialValues}
                validationSchema={reportValidationSchema}
                onSubmit={reportHandleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                  <Form className='form'>
                    <div className='form-body fade-in-up delay-5'>
                      <div className='form-column'>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Motivo del reporte</span>
                          <textarea id='motivoReporte' name='motivoReporte' className='textarea' rows={4} onChange={handleChange} onBlur={handleBlur} value={values.motivoReporte}></textarea>
                          <FormError text={errors.motivoReporte} touched={touched.motivoReporte} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Rendimiento académico</span>
                          <ReactSelect
                            id='rendimientoAcademico'
                            name='rendimientoAcademico'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('rendimientoAcademico', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.rendimientoAcademico)}
                            styles={selectStyle} />
                          <FormError text={errors.rendimientoAcademico} touched={touched.rendimientoAcademico} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Cumplimiento de tareas y trabajos</span>
                          <ReactSelect
                            id='cumplimientoTareas'
                            name='cumplimientoTareas'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('cumplimientoTareas', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.cumplimientoTareas)}
                            styles={selectStyle} />
                          <FormError text={errors.cumplimientoTareas} touched={touched.cumplimientoTareas} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Disciplina en el aula</span>
                          <ReactSelect
                            id='disciplina'
                            name='disciplina'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('disciplina', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.disciplina)}
                            styles={selectStyle} />
                          <FormError text={errors.disciplina} touched={touched.disciplina} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Participación</span>
                          <ReactSelect
                            id='participacion'
                            name='participacion'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('participacion', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.participacion)}
                            styles={selectStyle} />
                          <FormError text={errors.participacion} touched={touched.participacion} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Atiende las explicaciones</span>
                          <ReactSelect
                            id='atiendeExplicaciones'
                            name='atiendeExplicaciones'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('atiendeExplicaciones', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.atiendeExplicaciones)}
                            styles={selectStyle} />
                          <FormError text={errors.atiendeExplicaciones} touched={touched.atiendeExplicaciones} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Asistencia y puntualidad</span>
                          <ReactSelect
                            id='asistencia'
                            name='asistencia'
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            onChange={(option: any) => {
                              setFieldValue('asistencia', `${option.value}`);
                            }}
                            onBlur={handleBlur}
                            value={reportPerformanceOptions.find(option => option.value === values.asistencia)}
                            styles={selectStyle} />
                          <FormError text={errors.asistencia} touched={touched.asistencia} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Profesor que reporta</span>
                          <input id='profesor' name='profesor' className='input' type='text' onChange={handleChange} onBlur={handleBlur} value={values.profesor} />
                          <FormError text={errors.profesor} touched={touched.profesor} />
                        </div>
                      </div>
                      <div className='form-column'>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Asignatura</span>
                          <input id='asignatura' name='asignatura' className='input' type='text' onChange={handleChange} onBlur={handleBlur} value={values.asignatura} />
                          <FormError text={errors.asignatura} touched={touched.asignatura} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Comentario del alumno(a)</span>
                          <textarea id='comentarioAlumno' name='comentarioAlumno' className='textarea' rows={4} onChange={handleChange} onBlur={handleBlur} value={values.comentarioAlumno}></textarea>
                          <FormError text={errors.comentarioAlumno} touched={touched.comentarioAlumno} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Actitud</span>
                          <textarea id='actitud' name='actitud' className='textarea' rows={3} onChange={handleChange} onBlur={handleBlur} value={values.actitud}></textarea>
                          <FormError text={errors.actitud} touched={touched.actitud} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Entrevista con padres de familia</span>
                          <input id='entrevistaPadresFecha' name='entrevistaPadresFecha' className='input' type='date' onChange={handleChange} onBlur={handleBlur} value={values.entrevistaPadresFecha} />
                          <textarea id='entrevistaPadres' name='entrevistaPadres' style={{ marginTop: '1rem' }} className='textarea' rows={6} onChange={handleChange} onBlur={handleBlur} value={values.entrevistaPadres}></textarea>
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Acuerdos y compromisos de alumno y padres de familia</span>
                          <textarea id='acuerdos' name='acuerdos' className='textarea' rows={5} onChange={handleChange} onBlur={handleBlur} value={values.acuerdos}></textarea>
                          <FormError text={errors.acuerdos} touched={touched.acuerdos} />
                        </div>
                      </div>
                    </div>
                    <div className='form-footer fade-in-up delay-5'>
                      <button className='button-primary' type='submit'>Aceptar</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        break;
      }
      default: {
        layout =
          <div className='grade'>
            <div className='grade-header'>
              <div className='identification'>
                <span className='name fade-in-up delay-3'>{student.nombre}</span>
                <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
                <div className='grado-grupo fade-in-up delay-5'>
                  <span className='grado'>Grado: {student.grado}°</span>
                  <span className='grupo'>{student.grupo}</span>
                </div>
              </div>
              <span className='date fade-in-up delay-3'>{date}</span>
            </div>
            <div className='grade-body'>
              <Formik
                initialValues={gradeInitialValues}
                validationSchema={gradeValidationSchema}
                onSubmit={gradeHandleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur }) => (
                  <Form className='form'>
                    <div className='form-body fade-in-up delay-5'>
                      <div className='input-column no-pad'>
                        <span className='input-label'>Nombre de la asignatura</span>
                        <input id='asignatura' name='asignatura' className='input' type='text' onChange={handleChange} onBlur={handleBlur} value={values.asignatura} />
                        <FormError text={errors.asignatura} touched={touched.asignatura} />
                      </div>
                      <div className='input-column no-pad'>
                        <span className='input-label'>Calificación</span>
                        <input id='calificacion' name='calificacion' className='input' type='number' onChange={handleChange} onBlur={handleBlur} value={values.calificacion} />
                        <FormError text={errors.calificacion} touched={touched.calificacion} />
                      </div>
                    </div>
                    <div className='form-footer fade-in-up delay-7'>
                      <button type='submit' className='button-text'>
                        <i className='fa-solid fa-add icon'></i>
                        Agregar
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className='grades'>
                {grades.map((grade: GradeValues, index: number) => (
                  <div className='grade' key={index}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className='asignatura'>{grade.asignatura}</span>
                      <span className='calificacion'>{grade.calificacion}</span>
                    </div>
                    <button className='delete-grade' onClick={() => { deleteGrade(index) }}><i className='fa-solid fa-trash'></i></button>
                  </div>
                ))}
              </div>
            </div>
            <div className='grade-footer fade-in-up delay-5'>
              <button className='button-primary' onClick={onSubmitFinalGrades}>Aceptar</button>
            </div>
          </div>
        break;
      }
    }

    return layout;
  }

  if (redirect) {
    return (
      <Navigate to={`/student/${id}`} />
    );
  }

  if (loading) {
    return (
      <div className='container'>
        <Header
          title={`Agregar ${determineTitle(type)}`}
          backButtonRoute={`/student/${id}`} />
        <div className='c-body' style={{ justifyContent: 'center' }}>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='container'>
        <Header
          title={`Agregar ${determineTitle(type)}`}
          backButtonRoute={`/student/${id}`} />
        <div className='c-body spaced'>
          {determineLayout(type)}
        </div>
      </div>
      <Dialog
        visible={successDialogVisible}
        title='Información agregada'
        closable={true}
        onConfirm={() => { setSuccessDialogVisible(false); }}
        onClose={() => { setSuccessDialogVisible(false); }}
        onCancel={() => { setSuccessDialogVisible(false); }}
        prompt={true}>
        Información agregada exitosamente
      </Dialog>
    </>
  );
};

export default AddInformation;
