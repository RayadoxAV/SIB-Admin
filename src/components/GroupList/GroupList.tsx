import React, { useContext, useState } from 'react';

import { Form, Formik } from 'formik';
import ReactSelect from 'react-select';
import * as Yup from 'yup';

import { selectStyle } from '../../util/reactSelectStyle';

import './GroupList.css';
import FormError from '../form-error/FormError';
import { AppContext } from '../../State';
import { useDate } from '../../hooks/useDate';
import { printList } from '../../util/printing';

const gradoOptions = [
  { value: 1, label: '1°' },
  { value: 2, label: '2°' },
  { value: 3, label: '3°' }
];

const grupoOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
];

interface FormValues {
  grado: string;
  grupo: string;
};

const initialValues: FormValues = {
  grado: '',
  grupo: ''
};

const validationSchema = Yup.object({
  grado: Yup.string().required('Seleccione una grado'),
  grupo: Yup.string().required('Seleccione un grupo')
});

const GroupList: React.FC = () => {

  const [appContext, _] = useContext(AppContext);

  const [filteredStudents, setFilteredStudents] = useState([] as any[]);

  const date = useDate();

  const [grado, setGrado] = useState('');
  const [grupo, setGrupo] = useState('');

  function handleSubmit(values: FormValues, { resetForm }: any) {
    const tempStudents = [] as any[];

    for (let i = 0; i < appContext.students.length; i++) {
      const student = { ...appContext.students[i] };
      if (student.informacion.grado === values.grado && student.informacion.grupo.toUpperCase() === values.grupo) {
        tempStudents.push(student);
      }

      if (i === 98) {
        break;
      }
    }
    setGrado(values.grado);
    setGrupo(values.grupo);

    tempStudents.sort((a, b) => {
      const textA = a.pApellido.toLowerCase();
      const textB = b.pApellido.toLowerCase();
  
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  

    setFilteredStudents(tempStudents);
  }

  function print() {
    printList(filteredStudents, grado, grupo);
  }

  return (
    <div className='group-list-container'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
          <Form className='filter fade-in-up delay-3' style={{ opacity: '0' }}>
            <div className='input-column'>
              <span className='input-label'>Grado</span>
              <ReactSelect
                className='react-select'
                options={gradoOptions}
                styles={selectStyle}
                onChange={(option: any) => {
                  setFieldValue('grado', option.value);
                }}
                onBlur={handleBlur}
                value={(grupoOptions.find(option => option.value === values.grado))}
              />
              <FormError text={errors.grado} touched={touched.grado} />
            </div>
            <div className='input-column'>
              <span className='input-label'>Grupo</span>
              <ReactSelect
                className='react-select'
                options={grupoOptions}
                styles={selectStyle}
                onChange={(option: any) => {
                  setFieldValue('grupo', `${option.value}`);
                }}
                onBlur={handleBlur}
                value={(grupoOptions.find(option => option.value === values.grupo))}
              />
              <FormError text={errors.grupo} touched={touched.grupo} />
            </div>
            <div className='input-column'>
              <span className='input-label'>&nbsp;</span>
              <button className='button-primary' type='submit'>Aceptar</button>
              <span className='form-error'>&nbsp;</span>
            </div>
          </Form>
        )}
      </Formik>
      <div className='list fade-in-up delay-3' style={{ opacity: '0' }}>
        {
          filteredStudents.length > 0 ?
            (
              <>
                <div className='list-header fade-in-up'>
                  <div className='list-head'>
                    <span className='title'>Lista de alumnos</span>
                    <span className='date'>{date}</span>
                    <button className='button-filled' onClick={print}>
                      <i className='icon fa-solid fa-print'></i>
                      <span className='text'>Imprimir</span>
                    </button>
                  </div>
                  <span className='grado-grupo'>Grupo: {grado}°{grupo}</span>
                </div>
                <div className='list-body fade-in-up'>
                  {
                    filteredStudents.map((student: any, index: number) => (
                      <div className='list-item' key={index}>
                        <span className='number'>{index + 1}</span>
                        <span className='matricula'>{student.matricula}</span>
                        <span className='name'>{student.pApellido} {student.sApellido} {student.nombres}</span>
                      </div>
                    ))
                  }
                </div>
              </>
            ) :
            (
              'No se encontraron estudiantes'
            )
        }
      </div>
    </div>
  );
};

export default GroupList;
