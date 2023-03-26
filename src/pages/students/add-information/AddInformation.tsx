import React, { useContext, useEffect, useState } from 'react';

import { Navigate, useParams } from 'react-router-dom';

import { AppContext } from '../../../State';
import Header from '../../../components/Header/Header';

import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';

import Report from './report/Report';

import './AddInformation.css';
import Dialog from '../../../components/Dialog/Dialog';
import Grade from './grade/Grade';


const AddInformation: React.FC = () => {

  const { type, id } = useParams();

  const [appContext, dispatch] = useContext(AppContext);

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(undefined as any);
  
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  useEffect(() => {
    setLoading(true);

    const students = appContext.students;

    if (students.length < 1) {
      setRedirect(true);
      return;
    }

    for (let i = 0; i < students.length; i++) {
      const tempStudent = students[i];
      if (tempStudent.id == id) {
        setStudent(tempStudent);
        setLoading(false);
        break;
      }
    }
    
  }, []);

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

      case 'estudioSoc': {
        title = 'estudio socioeconómico';
        break;
      }

      default: {
        title = 'no determinado';
        break;
      }
    }

    return title;
  }

  function getComponent(type: string | undefined): JSX.Element {
    let component;

    switch (type) {
      case 'report': {
        component = 
          <Report 
            student={student}
            onSuccess={() => { setSuccessDialogVisible(true); }}/>;
        break;
      }

      case 'grade': {
        component =
          <Grade 
            student={student}
            onSuccess={() => { setSuccessDialogVisible(true); }}/>;
        break;
      }

      case 'estudioSoc': {
        component = <div>hola</div>;
        break;
      }
      
      default: {
        component = <div>Not implemented</div>
        break;
      }
    }

    return component;
  }

  if (redirect) {
    return (
      <Navigate to='/students' />
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
          {getComponent(type)}
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
