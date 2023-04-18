import React, { FormEvent, useState } from 'react';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/Header/Header';

import './AddStudent.css';
import FormError from '../../../components/form-error/FormError';
import { SERVER_IP } from '../../../util/util';
import Dialog from '../../../components/Dialog/Dialog';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';

interface AddStudentValues {
  nombres: string;
  pApellido: string;
  sApellido: string;
  fechaNac: string;
  curp: string;
  telefono: string;
  direccion: string;
  colonia: string;
  localidad: string;
  grado: number;
  grupo: string;
  anioEntrada: number;
};

const initialValues: AddStudentValues = {
  nombres: '',
  pApellido: '',
  sApellido: '',
  fechaNac: '',
  curp: '',
  telefono: '',
  direccion: '',
  colonia: '',
  localidad: '',
  grado: 1,
  grupo: 'A',
  anioEntrada: new Date().getFullYear()
};

const validationSchema = Yup.object({
  nombres: Yup.string().required('Ingrese un nombre'),
  pApellido: Yup.string().required('Ingrese el primer apellido'),
  sApellido: Yup.string(),
  fechaNac: Yup.string().required('Seleccione una fecha de nacimiento'),
  curp: Yup.string().required('Ingrese una CURP').matches(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/, 'Ingrese una CURP válida'),
  telefono: Yup.string().required('Ingrese un número de teléfono').matches(/^[0-9]{10}$/, 'Ingrese un teléfono válido'),
  direccion: Yup.string().required('Ingrese una dirección'),
  colonia: Yup.string().required('Ingrese una colonia'),
  localidad: Yup.string().required('Ingrese una localidad'),
  grado: Yup.number().required('Ingrese un grado').min(1, 'Ingrese un grado válido').max(3, 'Ingrese un grado válido'),
  grupo: Yup.string().required('Escribe un grupo').matches(/^[A-H]{1}$/, 'Escribe un grupo válido'),
  anioEntrada: Yup.number().required('Ingrese el año de entrada').min(2000, 'Ingrse un año más reciente').max(new Date().getFullYear(), 'No se puede ingresar en el futuro')
});

const AddStudent: React.FC = () => {

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  function handleSubmit(values: AddStudentValues, { resetForm }: any) {
    console.log(values);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        nombreAlumno: values.nombres,
        pApellido: values.pApellido,
        sApellido: values.sApellido,
        fechaNac: values.fechaNac,
        curp: values.curp,
        telefono: values.telefono,
        direccion: values.direccion,
        colonia: values.colonia,
        localidad: values.localidad,
        grado: values.grado,
        grupo: values.grupo,
        anioEntrada: values.anioEntrada
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/students`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Error al agregar el estudiante. Inténtelo de nuevo más tarde.');
        return;
      }

      if (response.registerStatusCode === 1) {
        alert('Error al agregar el estudiante. Inténtelo de nuevo más tarde.');
        return;
      }

      resetForm();
      setSuccessDialogVisible(true);
    });
  }

  return (
    <>
      <div className='container'>
        <Header
          title='Agregar estudiante'
          backButtonRoute='/students' />
        <Breadcrumb 
          crumbs={['Inicio', 'Estudiantes', 'Agregar estudiante']}
          routes={['/', '/students', '/add-student']} />
        <div className='c-body spaced'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className='form'>
                <div className='form-body fade-in-up delay-3'>
                  <div className='input-column'>
                    <span className='input-label'>Nombres</span>
                    <input type='text' id='nombres' name='nombres' className='input' onChange={handleChange} onBlur={handleBlur} value={values.nombres} autoComplete='off' />
                    <FormError text={errors.nombres} touched={touched.nombres} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Primer apellido</span>
                    <input type='text' id='pApellido' name='pApellido' className='input' onChange={handleChange} onBlur={handleBlur} value={values.pApellido} autoComplete='off' />
                    <FormError text={errors.pApellido} touched={touched.pApellido} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Segundo apellido</span>
                    <input type='text' id='sApellido' name='sApellido' className='input' onChange={handleChange} onBlur={handleBlur} value={values.sApellido} autoComplete='off' />
                    <FormError text={errors.sApellido} touched={touched.sApellido} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Fecha de nacimiento</span>
                    <input type='date' id='fechaNac' name='fechaNac' className='input' onChange={handleChange} onBlur={handleBlur} value={values.fechaNac} autoComplete='off' />
                    <FormError text={errors.fechaNac} touched={touched.fechaNac} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>CURP</span>
                    <input type='text' id='curp' name='curp' className='input' onChange={handleChange} onBlur={handleBlur} value={values.curp} autoComplete='off' />
                    <FormError text={errors.curp} touched={touched.curp} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Teléfono</span>
                    <input type='text' id='telefono' name='telefono' className='input' onChange={handleChange} onBlur={handleBlur} value={values.telefono} autoComplete='off' maxLength={10} />
                    <FormError text={errors.telefono} touched={touched.telefono} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Dirección</span>
                    <input type='text' id='direccion' name='direccion' className='input' onChange={handleChange} onBlur={handleBlur} value={values.direccion} autoComplete='off' />
                    <FormError text={errors.direccion} touched={touched.direccion} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Colonia</span>
                    <input type='text' id='colonia' name='colonia' className='input' onChange={handleChange} onBlur={handleBlur} value={values.colonia} autoComplete='off' />
                    <FormError text={errors.colonia} touched={touched.colonia} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Localidad</span>
                    <input type='text' id='localidad' name='localidad' className='input' onChange={handleChange} onBlur={handleBlur} value={values.localidad} autoComplete='off' />
                    <FormError text={errors.localidad} touched={touched.localidad} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Grado</span>
                    <input type='number' id='grado' name='grado' className='input' onChange={handleChange} onBlur={handleBlur} value={values.grado} autoComplete='off' />
                    <FormError text={errors.grado} touched={touched.grado} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Grupo</span>
                    <input type='text' id='grupo' name='grupo' className='input' onChange={handleChange} onBlur={handleBlur} value={values.grupo} autoComplete='off' />
                    <FormError text={errors.grupo} touched={touched.grupo} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Año de entrada</span> 
                    <input type='text' id='anioEntrada' name='anioEntrada' className='input' onChange={handleChange} onBlur={handleBlur} value={values.anioEntrada} autoComplete='off' />
                    <FormError text={errors.anioEntrada} touched={touched.anioEntrada} />
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
      <Dialog
        visible={successDialogVisible}
        title='Estudiante agregado'
        closable={true}
        onConfirm={() => { setSuccessDialogVisible(false); }}
        onClose={() => { setSuccessDialogVisible(false); }}
        onCancel={() => { setSuccessDialogVisible(false); }}
        prompt={true}>
        Estudiante agregado correctamente
      </Dialog>
    </>
  );
};

export default AddStudent;
