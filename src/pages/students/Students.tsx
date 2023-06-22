import React, { useContext, useEffect, useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Table from '../../components/table/Table';

import { SERVER_IP } from '../../util/util';

import { AppContext } from '../../State';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';
import GroupList from '../../components/GroupList/GroupList';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

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
    displayName: 'Grado',
    nested: true,
    parent: 'informacion'
  },
  {
    name: 'grupo',
    displayName: 'grupo',
    nested: true,
    parent: 'informacion'
  },
  {
    name: 'estado',
    displayName: 'Estado'
  }
];

const Students: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([] as any);
  const [documents, setDocuments] = useState([]);

  const [redirectLogin, setRedirectLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (appContext.students) {
      if (appContext.students.length === 0) {
        setLoading(false);
      } else {
        setLoading(false);
        setStudents(appContext.students);
      }
    } else {
      setLoading(false);
    }
  }, []);

  function deleteStudents(rows: Set<number>) {
    const deleteRows = Array.from(rows);
    deleteRows.sort((a, b) => (
      b - a
    ));

    const tempStudents = [...students];
    const deleteIds = [] as number[];

    deleteRows.forEach((value: number) => {
      deleteIds.push(students[value].id);
      tempStudents.splice(value, 1);
    });

    const token = localStorage.getItem('token');
    if (!token) {
      setRedirectLogin(true);
      return;
    }

    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ids: deleteIds
      })
    };

    fetch(`${SERVER_IP}/students`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.deleteStatusCode === 0) {

      }
    }).catch((error) => {
      console.log(error);
    });
  }

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
      <Breadcrumb
        crumbs={['Inicio', 'Estudiantes']}
        routes={['/', '/students']} />
      <div className='c-body'>
        <TabPanel
          tabs={['Concentrado', 'Listas']}>
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
                  data={appContext.students}
                  informationRoute='/student'
                  searchable={true}
                  clickable={true}
                  selectable={true}
                  editable={true}
                  pageSize={8}
                  performEdit={(student: any) => {
                    console.log(student);
                    navigate(`/edit-student/:${student.id}`);
                  }}
                  performDelete={deleteStudents}
                  // searchParams={['nombres', 'pApellido', 'sApellido', 'matricula', 'CURP', 'grado:', 'grupo:', 'estado:']}
                  searchParams={
                    [
                      {
                        name: 'nombres'
                      },
                      {
                        name: 'pApellido'
                      },
                      {
                        name: 'sApellido'
                      },
                      {
                        name: 'matricula'
                      },
                      {
                        name: 'CURP'
                      },
                      {
                        name: 'grado:',
                        nested: true,
                        parent: 'informacion'
                      },
                      {
                        name: 'grupo:',
                        nested: true,
                        parent: 'informacion'
                      },
                      {
                        name: 'estado:',
                        nested: false
                      }
                    ]
                  }
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
