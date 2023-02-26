import { Form, Formik } from 'formik';
import { title } from 'process';
import React, { useEffect, useState, useContext } from 'react';

import { Navigate, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';

import Clock from '../../../components/Clock/Clock';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import { useDate } from '../../../hooks/useDate';
import { AppContext } from '../../../State';
import { selectStyle } from '../../../util/reactSelectStyle';

import './AddInformation.css';
import { reporteHandleSubmit, reportInitialValues, reportPerformanceOptions, reportValidationSchema } from './InformationForms';

const AddInformation: React.FC = () => {

  const { type, id } = useParams();

  const [appContext, dispatch] = useContext(AppContext);

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(undefined as any);

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

  function determineTitle(type: string | undefined): string {
    let title = '';
    switch (type) {
      case 'report': {
        title = 'reporte';
        break;
      }

      default: {
        title = 'algo no anda bien';
        break;
      }
    }

    return title;
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
                onSubmit={reporteHandleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                  <Form className='form'>
                    <div className='form-body fade-in-up delay-5'>
                      <div className='form-column'>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Motivo del reporte</span>
                          <input className='input' type='text' />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Rendimiento académico</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Cumplimiento de tareas y trabajos</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Disciplina en el aula</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Participación</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Atiende las explicaciones</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Asistencia y puntualidad</span>
                          <ReactSelect
                            className='react-select'
                            required={true}
                            options={reportPerformanceOptions}
                            styles={selectStyle} />
                        </div>
                        <div className='input-column no-pad'>
                          <span className='input-label'>Profesor que reporta</span>
                          <input className='input' type='text' />
                        </div>
                      </div>
                      <div className='form-column'>
                        <div className='input-column no-pad'></div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        break;
      }
      default: {
        layout = <div>Not implemented</div>
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
        <div className='c-header'>
          <button className='back-button fade-in-up' onClick={handleClick}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
          <Clock className='fade-in-up' />
          <span className='title fade-in-up'>Agregar {determineTitle(type)}</span>
        </div>
        <div className='c-body' style={{ justifyContent: 'center' }}>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='c-header'>
        <button className='back-button fade-in-up' onClick={handleClick}>
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        <Clock className='fade-in-up' />
        <span className='title fade-in-up'>Agregar {determineTitle(type)}</span>
      </div>
      <div className='c-body spaced'>
        {determineLayout(type)}
      </div>
    </div>
  );
};

export default AddInformation;
