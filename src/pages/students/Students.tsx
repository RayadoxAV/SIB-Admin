import React, { useContext, useEffect, useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Table from '../../components/table/Table';

import { useDate } from '../../hooks/useDate';
import { SERVER_IP } from '../../util/util';

import { AppContext } from '../../State';
import Clock from '../../components/Clock/Clock';

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

// const mockData = [
//   {
//     header1: 'tal',
//     header2: 'cual',
//     header3: 'lo',
//     header4: 'que',
//     header5: 'te',

//   }
// ];

const Students: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const [redirect, setRedirect] = useState(false);
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
          setLoading(false);
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

  function handleClick() {
    setRedirect(true);
  }

  if (redirect) {
    return (
      <Navigate to="/" />
    );
  }

  if (redirectLogin) {
    return (
      <Navigate to="/login" />
    );
  }

  return (
    <div className='container'>
      <div className='c-header'>
        <button className='back-button fade-in-right' onClick={handleClick}>
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        <Clock className='fade-in-right delay-3' />
        <span className='title fade-in-right delay-5'>Estudiantes</span>
      </div>
      <div className='c-body'>
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
                searchParams={['nombre', 'matricula', 'CURP', 'grado:', 'grupo:', 'estado:']}
                addUrl='/add-student' />
            )
        }
      </div>
      <div className='c-footer'></div>
    </div>
  );
};

export default Students;
