import React, { useContext, useEffect, useState } from 'react';

import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Table from '../../components/table/Table';

import { SERVER_IP } from '../../util/util';

import { AppContext } from '../../State';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';
import GroupList from '../../components/GroupList/GroupList';

const headers = [
  {
    name: 'matricula',
    displayName: 'Matrícula'
  },
  {
    name: 'nombres',
    displayName: 'Nombres'
  },
  {
    name: 'pApellido',
    displayName: 'Primer apellido'
  },
  {
    name: 'sApellido',
    displayName: 'Segundo apellido'
  },
  {
    name: 'grado',
    displayName: 'Grado'
  },
  {
    name: 'grupo',
    displayName: 'grupo'
  },
  {
    name: 'estado',
    displayName: 'Estado'
  }
];

const Students: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    dispatch({ type: 'setTitle', title: 'SI Estudiantes' });

    if (appContext.students.length === 0) {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setRedirectLogin(true);
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      fetch(`${SERVER_IP}/students`, requestOptions).then((res) => (res.json()).then((response) => {
        if (response.queryStatusCode === 0) {
          const queryStudents = response.result;

          for (let i = 0; i < queryStudents.length; i++) {
            let student = queryStudents[i];
            student.nombre = `${student.nombres} ${student.pApellido} ${student.sApellido}`;
            const informacion = JSON.parse(student.informacion);
            student = { ...student, ...informacion };

            queryStudents[i] = student;
          }
          dispatch({ type: 'setStudents', students: queryStudents });
          setStudents(queryStudents);

          if (appContext.documents.length === 0) {
            const documentsRequestOptions = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            };

            fetch(`${SERVER_IP}/documents`, documentsRequestOptions).then((res) => (res.json()).then((response) => {
              if (response.queryStatusCode === 0) {
                const queryDocuments = response.result;

                for (let i = 0; i < queryDocuments.length; i++) {
                  let document = queryDocuments[i];
                  const information = JSON.parse(document.informacion);
                  document.informacion = information;

                  queryDocuments[i] = document;
                }

                dispatch({ type: 'setDocuments', documents: queryDocuments });
                setDocuments(queryDocuments);
                setLoading(false);
              } else if (response.queryStatusCode === 1) {
                console.log('manejar el error');
              }
            }));

          } else {
            setLoading(false);
            setDocuments(appContext.documents);
          }
          // setLoading(false);
        } else if (response.queryStatusCode === 1) {
          console.log('manejar error');
        }
      })).catch((error) => {
        console.log('manejar el error');
      });
    } else {
      setLoading(false);
      setStudents(appContext.students);

    }

    // console.log(appContext);
  }, []);

  if (redirectLogin) {
    return (
      <Navigate to="/login" />
    );
  }

  return (
    <div className='container'>
      <Header
        title='Estudiantes'
        backButtonRoute='/' />
      <div className='c-body'>
        <TabPanel
          tabs={['Concentrado', 'Listas', 'Otros']}>
          {
            loading ?
              (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <LoadingIndicator />
                </div>
              ) :
              (
                <Table
                  headers={headers}
                  data={students}
                  informationRoute='/student'
                  searchable={true}
                  clickable={true}
                  selectable={true}
                  editable={true}
                  pageSize={8}
                  searchParams={['nombre', 'matricula', 'CURP', 'grado:', 'grupo:', 'estado:']}
                  addUrl='/add-student' />
              )
          }
          {
            loading ?
              (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <LoadingIndicator />
                </div>
              ) :
              (
                <GroupList />
              )
          }
        </TabPanel>

      </div>
      <div className='c-footer'></div>
    </div>
  );
};

export default Students;
