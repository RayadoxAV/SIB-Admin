import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import Clock from '../../components/Clock/Clock';
import * as Yup from 'yup';
import { selectStyle } from '../../util/reactSelectStyle';
import FormError from '../../components/form-error/FormError';
import { SERVER_IP } from '../../util/util';
import Dialog from '../../components/Dialog/Dialog';
import { AppContext } from '../../State';

interface FormValues {
  username: string;
  password: string;
  nombres: string;
  pApellido: string;
  sApellido: string;
  rol: string;
};

const rolOptions = [
  { value: '1', label: 'Administrador' },
  { value: '2', label: 'Usuario' },
  { value: '5', label: 'Invitado' }
];

const AddUser: React.FC = () => {

  const [redirect, setRedirect] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [_, dispatch] = useContext(AppContext);

  function handleBackButton() {
    setRedirect(true);
  }

  const initialValues: FormValues = {
    username: '',
    password: '',
    nombres: '',
    pApellido: '',
    sApellido: '',
    rol: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Ingrese un nombre de usuario'),
    password: Yup.string().required('Ingrese una contraseña'),
    nombres: Yup.string().required('Ingrese al menos un nombre'),
    pApellido: Yup.string().required('Ingrese un apellido'),
    sApellido: Yup.string(),
    rol: Yup.string().required('Seleccione un rol')
  });

  function handleSubmit(values: FormValues, { resetForm }: any) {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        nombreUsuario: values.username,
        password: values.password,
        nombres: values.nombres,
        pApellido: values.pApellido,
        sApellido: values.sApellido,
        role: values.rol
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/users`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Error al agregar usuario. Inténtelo de nuevo más tarde');
        return;
      }

      if (response.registerStatusCode === 1) {
        alert('Error al agregar usuario. Datos inválidos');
        return;
      }

      resetForm();
      setSuccessDialogVisible(true);
      dispatch({ type: 'setUsers', users: [] });

    });
  }

  if (redirect) {
    return (
      <Navigate to="/users" />
    );
  }

  return (
    <>
      <div className='container'>
        <div className='c-header'>
          <button className='back-button fade-in-up' onClick={handleBackButton}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
          <Clock className='fade-in-up' />
          <span className='title fade-in-up'>Agregar usuario</span>
        </div>
        <div className='c-body spaced'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <Form className='form'>
                <div className='form-body fade-in-up delay-3'>
                  <div className='input-column'>
                    <span className='input-label'>Nombre de usuario</span>
                    <input className='input' type='text' name='username' id='username' autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.username} />
                    <FormError text={errors.username} touched={touched.username} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Contraseña</span>
                    <input className='input' type='password' name='password' id='password' autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.password} />
                    <FormError text={errors.password} touched={touched.password} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Nombres</span>
                    <input className='input' type='text' name='nombres' id='nombres' autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.nombres} />
                    <FormError text={errors.nombres} touched={touched.nombres} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Primer apellido</span>
                    <input className='input' type='text' name='pApellido' id='pApellido' autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.pApellido} />
                    <FormError text={errors.pApellido} touched={touched.pApellido} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Segundo apellido</span>
                    <input className='input' type='text' name='sApellido' id='sApellido' autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.sApellido} />
                    <FormError text={errors.sApellido} touched={touched.sApellido} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Rol</span>
                    <ReactSelect
                      className='react-select'
                      required={true}
                      options={rolOptions}
                      styles={selectStyle}
                      value={rolOptions.find(option => option.value === values.rol)}
                      onChange={(option: any) => {
                        setFieldValue('rol', `${option.value}`);
                      }} />
                    <FormError text={errors.rol} touched={touched.rol} />
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
        title='Usuario agregado'
        closable={true}
        onConfirm={() => { setSuccessDialogVisible(false); }}
        onClose={() => { setSuccessDialogVisible(false); }}
        onCancel={() => { setSuccessDialogVisible(false); } }
        prompt={true}
      >
        Usuario agregado exitosamente
      </Dialog>
    </>
  );
};

export default AddUser;
