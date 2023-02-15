import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../State';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';

import './Login.css';
import { SERVER_IP } from '../../util/util';
import { appWindow } from '@tauri-apps/api/window';
import FormError from '../../components/form-error/FormError';

interface FormValues {
  username: string;
  password: string;
};

const Login: React.FC = () => {

  const [_, dispatch] = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'setTitle', title: 'SI Iniciar sesión' })
  }, []);

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Escriba un nombre de usuario'),
    password: Yup.string().required('Escriba una contraseña')
  });

  function handleSubmit(values: FormValues, { resetForm }: any) {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        identifier: values.username,
        password: values.password,
        loginType: 0
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    fetch(`${SERVER_IP}/login`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Hubo un error al iniciar sesión. Inténtelo de nuevo más tarde');
        return;
      }

      if (response.loginStatusCode === 1) {
        alert('El usuario o la contraseña son incorrectos');
        return;
      }

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      appWindow.setResizable(true);
      appWindow.maximize();

      navigate('/', { replace: true });
    });
  }

  return (
    <div className='login-container'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form className='login-form'>
            <span className='header fade-in-up'>Iniciar sesión</span>
            <div className='input-column fade-in-up delay-3'>
              <span className='input-label'>Nombre de usuario</span>
              <input className='input' type="text" name="username" id="username" autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.username} />
              <FormError text={errors.username} touched={touched.username} />
            </div>
            <div className='input-column fade-in-up delay-3'>
              <span className='input-label'>Contraseña</span>
              <input className='input' type="password" name="password" id="password" autoComplete='off' onChange={handleChange} onBlur={handleBlur} value={values.password} />
              <FormError text={errors.password} touched={touched.password} />
            </div>
            <button className='button-primary fade-in-up delay-5' type='submit'>Aceptar</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
