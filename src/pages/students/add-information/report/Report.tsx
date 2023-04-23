import React from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';

import { useDate } from '../../../../hooks/useDate';
import FormError from '../../../../components/form-error/FormError';
import { selectStyle } from '../../../../util/reactSelectStyle';

import { SERVER_IP } from '../../../../util/util';

interface ReportProps {
  student: any;
  onSuccess: Function
};

const reportPerformanceOptions = [
  { value: '0', label: 'Excelente' },
  { value: '1', label: 'Bueno' },
  { value: '2', label: 'Regular' },
  { value: '3', label: 'Malo' }
];

interface ReportValues {
  motivoReporte: string;
  rendimientoAcademico: string;
  cumplimientoTareas: string;
  disciplina: string;
  participacion: string;
  atiendeExplicaciones: string;
  asistencia: string;
  profesor: string;
  asignatura: string;
  comentarioAlumno: string;
  actitud: string;
  entrevistaPadresFecha: string;
  entrevistaPadres: string;
  acuerdos: string;
};

const initialValues: ReportValues = {
  motivoReporte: '',
  rendimientoAcademico: '1',
  cumplimientoTareas: '1',
  disciplina: '1',
  participacion: '1',
  atiendeExplicaciones: '1',
  asistencia: '1',
  profesor: '',
  asignatura: '',
  comentarioAlumno: '',
  actitud: '',
  entrevistaPadresFecha: '',
  entrevistaPadres: '',
  acuerdos: ''
};

const validationSchema = Yup.object({
  motivoReporte: Yup.string().required('Introduzca un motivo para el reporte'),
  rendimientoAcademico: Yup.string().required('Seleccione un nivel de desempeño'),
  cumplimientoTareas: Yup.string().required('Seleccione un nivel de desempeño'),
  disciplina: Yup.string().required('Seleccione un nivel de desempeño'),
  participacion: Yup.string().required('Seleccione un nivel de desempeño'),
  atiendeExplicaciones: Yup.string().required('Seleccione un nivel de desempeño'),
  asistencia: Yup.string().required('Seleccione un nivel de desempeño'),
  profesor: Yup.string().required('Introduzca el nombre del profesor'),
  asignatura: Yup.string().required('Introduzca una asignatura'),
  comentarioAlumno: Yup.string().required('Introduzca el comentario del alumno (a)'),
  actitud: Yup.string().required('Describa la actitud del alumno'),
  entrevistaPadresFecha: Yup.date(),
  entrevistaPadres: Yup.string(),
  acuerdos: Yup.string().required('Escriba los acuerdos')
});

const Report: React.FC<ReportProps> = ({ student, onSuccess }) => {

  const date = useDate();

  function handleSubmit(values: ReportValues, { resetForm }: any) {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({
        type: 0,
        information: JSON.stringify({ ...values })
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/students/add-information/${student.id}`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Error al agregar la información. Inténtelo de nuevo más tarde.');
        return;
      }

      if (response.updateStatusCode === 1) {
        alert('Error al agregar la información. Datos inválidos.');
        return;
      }

      resetForm();
      onSuccess();
    });
  }

  return (
    <div className='report'>
      <div className='report-header'>
        <div className='identification'>
          <span className='name fade-in-up delay-3'>{student.nombres} {student.pApellido} {student.sApellido}</span>
          <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
          <div className='grado-grupo fade-in-up delay-5'>
            <span className='grado'>Grado: {student.informacion.grado}°</span>
            <span className='grupo'>{student.informacion.grupo}</span>
          </div>
        </div>
        <span className='date fade-in-up delay-3'>{date}</span>
      </div>
      <div className='report-body fade-in-up delay-5'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
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
  );
}

export default Report;
