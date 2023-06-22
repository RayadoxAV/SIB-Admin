import React, { useContext, useState, useEffect } from 'react';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { AppContext } from '../../../State';
import { useParams } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { Form, Formik } from 'formik';
import FormError from '../../../components/form-error/FormError';
import { selectStyle } from '../../../util/reactSelectStyle';
import { SERVER_IP } from '../../../util/util';
import Dialog from '../../../components/Dialog/Dialog';

interface EditUserValues {
  username: string;
  nombres: string;
  pApellido: string;
  sApellido: string;
  rol: string;
  status: string;
};

const rolOptions = [
  { value: '0', label: 'Root'},
  { value: '1', label: 'Administrador' },
  { value: '2', label: 'Oficinista' },
  { value: '3', label: 'Docente' }
];

const estadoOptions = [
  { value: '0', label: 'Activo' },
  { value: '1', label: 'Inactivo' }
];

const initialValues: EditUserValues = {
  username: '',
  nombres: '',
  pApellido: '',
  sApellido: '',
  rol: '',
  status: ''
};

const validationSchema = Yup.object({
  username: Yup.string().required('Ingrese un nombre de usuario'),
  nombres: Yup.string().required('Ingrese al menos un nombre'),
  pApellido: Yup.string().required('Ingrese un apellido'),
  sApellido: Yup.string(),
  rol: Yup.string().required('Seleccione un rol'),
  status: Yup.string().required('Seleccione un estado')
});

const EditUser: React.FC = () => {
  const [appContext, _] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined as any);

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    const users = appContext.users;

    for (let i = 0; i < users.length; i++) {
      const tempUser = users[i];

      if (tempUser.idUsuario == id) {

        initialValues.username = tempUser.nombreUsuario;
        initialValues.nombres = tempUser.nombres;
        initialValues.pApellido = tempUser.pApellido;
        initialValues.sApellido = tempUser.sApellido;
        initialValues.rol = `${tempUser.role}`;
        initialValues.status = `${tempUser.status}`;

        setUser(tempUser);
        setLoading(false);
        break;
      }
    }
  }, []);

  function handleSubmit(values: EditUserValues, { resetForm }: any) {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({
        nombreUsuario: values.username,
        nombres: values.nombres,
        pApellido: values.pApellido,
        sApellido: values.sApellido,
        role: Number.parseInt(values.rol),
        status: Number.parseInt(values.status)
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/user/${user.idUsuario}`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'ERROR') {
        alert('Error al editar al estudiante. Inténtelo de nuevo más tarde.');
        return;
      }

      if (response.updateStatusCode === 1) {
        alert('Error al editar al estudiante. Inténtelo de nuevo más tarde.');
        return;
      }

      setSuccessDialogVisible(true);
    })
  }

  if (loading) {
    return (
      <div className='container'>
        <Header
          title='Editar usuario'
          backButtonRoute='/users' />
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
          title='Editar usuario'
          backButtonRoute='/users' />
        <Breadcrumb
          crumbs={['Inicio', 'Usuarios', 'Editar usuario']}
          routes={['/', '/users', '/edit-user']} />
        <div className='c-body spaced'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className='form'>
                <div className='form-body fade-in-up delay-3'>
                  <div className='input-column no-pad'>
                    <span className='input-label'>Nombre de usuario</span>
                    <input id='username' name='username' type='text' className='input' onChange={handleChange} onBlur={handleBlur} value={values.username} autoComplete='off' />
                    <FormError text={errors.username} touched={touched.username} />
                  </div>
                  <div className='input-column no-pad'>
                    <span className='input-label'>Nombres</span>
                    <input id='nombres' name='nombres' type='text' className='input' onChange={handleChange} onBlur={handleBlur} value={values.nombres} autoComplete='off' />
                    <FormError text={errors.nombres} touched={touched.nombres} />
                  </div>
                  <div className='input-column no-pad'>
                    <span className='input-label'>Primer apellido</span>
                    <input type='text' id='pApellido' name='pApellido' className='input' onChange={handleChange} onBlur={handleBlur} value={values.pApellido} autoComplete='off' />
                    <FormError text={errors.pApellido} touched={touched.pApellido} />
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Segundo apellido</span>
                    <input type='text' id='sApellido' name='sApellido' className='input' onChange={handleChange} onBlur={handleBlur} value={values.sApellido} autoComplete='off' />
                    <FormError text={errors.sApellido} touched={touched.sApellido} />
                  </div>
                  <div className='input-column no-pad'>
                    <span className='input-label'>Rol</span>
                    <ReactSelect
                      menuPortalTarget={document.querySelector('body')}
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
                  <div className='input-column no-pad'>
                    <span className='input-label'>Estado</span>
                    <ReactSelect
                      menuPortalTarget={document.querySelector('body')}
                      className='react-select'
                      required={true}
                      options={estadoOptions}
                      styles={selectStyle}
                      value={estadoOptions.find(option => option.value === values.status)}
                      onChange={(option: any) => {
                        setFieldValue('status', `${option.value}`);
                      }} />
                      <FormError text={errors.status} touched={touched.status} />
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
        title='Usuario editado'
        closable={true}
        onConfirm={() => { setSuccessDialogVisible(false); }}
        onClose={() => { setSuccessDialogVisible(false); }}
        onCancel={() => { setSuccessDialogVisible(false); }}
        prompt={true}>
        Usuario editado correctamente
      </Dialog>
    </>
  );
};

export default EditUser;
