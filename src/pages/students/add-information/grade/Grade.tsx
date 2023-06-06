import React, { useState } from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import FormError from '../../../../components/form-error/FormError';
import { useDate } from '../../../../hooks/useDate';
import { SERVER_IP } from '../../../../util/util';

interface GradeProps {
  student: any;
  onSuccess: Function;
};

interface GradeValues {
  asignatura: string;
  calificacion: number;
};

const initialValues: GradeValues = {
  asignatura: '',
  calificacion: 0
}

const validationSchema = Yup.object({
  asignatura: Yup.string().required('Introduzca el nombre de la asignatura'),
  calificacion: Yup.number().required('Introduzca la calificación').min(0, 'El mínimo es cero').max(10, 'El máximo es diez')
});

const Grade: React.FC<GradeProps> = ({ student, onSuccess }) => {

  const date = useDate();

  const [grades, setGrades] = useState([] as GradeValues[]);

  function handleSubmit(grade: GradeValues, { resetForm }: any) {
    const tempGrades = [...grades];

    tempGrades.push(grade);

    setGrades(tempGrades);
    resetForm();
  }

  function deleteGrade(index: number) {
    const tempGrades = [...grades];
    
    tempGrades.splice(index, 1);

    setGrades(tempGrades);
  }

  function onSubmitGrades() {
    if (grades.length > 0) {
      const requestOptions = {
        method: 'PUT',
        body: JSON.stringify({
          type: 1,
          information: JSON.stringify(grades)
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      fetch(`${SERVER_IP}/students/add-information/${student.id}`, requestOptions).then((res) => res.json()).then((response) => {
        if (response.requestStatus === 'ERROR') {
          alert('Error al agregar la información. Inténtelo de nuevo más tarde.')
          return;
        }

        if (response.updateStatusCode === 1) {
          alert('Error al agregar la información. Datos inválidos.')
          return;
        }

        setGrades([]);
        onSuccess();
      })
    } else {
      alert('Agregue calificaciones para proceder');
    }
  }

  return (
    <div className='grade'>
      <div className='grade-header'>
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
      <div className='grade-body'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className='form'>
              <div className='form-body fade-in-up delay-5'>
                <div className='input-column no-pad'>
                  <span className='input-label'>Nombre de la asignatura</span>
                  <input type='text' id='asignatura' name='asignatura' className='input' onChange={handleChange} onBlur={handleBlur} value={values.asignatura} />
                  <FormError text={errors.asignatura} touched={touched.asignatura} />
                </div>
                <div className='input-column no-pad'>
                  <span className='input-label'>Calificación</span>
                  <input type='number' id='calificacion' name='calificacion' className='input' onChange={handleChange} onBlur={handleBlur} value={values.calificacion} />
                  <FormError text={errors.calificacion} touched={touched.calificacion} />
                </div>
              </div>
              <div className='form-footer fade-in-up delay-7'>
                <button type='submit' className='button-text'>
                  <i className='icon fa-solid fa-add'></i>
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
        <button className='button-primary' onClick={onSubmitGrades} type='button'>Aceptar</button>
      </div>
    </div>
  );
};

export default Grade;
