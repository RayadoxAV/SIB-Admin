import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { AppContext } from '../../State';
import { SERVER_IP } from '../../util/util';
import { Navigate } from 'react-router-dom';
import Table from '../../components/table/Table';

import './Controls.css';
import Dialog from '../../components/Dialog/Dialog';

const headers = [
  {
    name: 'id',
    displayName: 'Id'
  },
  {
    name: 'matricula',
    displayName: 'Matrícula'
  },
  {
    name: 'nombre',
    displayName: 'Nombre'
  },
  {
    name: 'grado',
    displayName: 'Grado'
  },
  {
    name: 'grupo',
    displayName: 'Grupo'
  }
];

const Controls: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  const [controls, setControls] = useState([]);
  const [becas, setBecas] = useState([] as any[]);
  const [enfermos, setEnfermos] = useState([] as any[]);
  const [verBien, setVerBien] = useState([] as any[]);
  const [situacionEspecial, setSituacionEspecial] = useState([] as any[]);
  const [isDialogVisible, setDialogVisible] = useState(false);


  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    console.log(appContext);
    // TODO: Change this to use sockets

    setControls(appContext.controls);

    const tempBecas: any[] = [];
    const tempEnfermos: any[] = [];
    const tempVerBien: any[] = [];
    const tempSituacionEspecial: any[] = [];

    for (let i = 0; i < appContext.controls.length; i++) {
      const control = appContext.controls[i];

      switch (control.tipoControl) {
        case 0: {
          const idStudent = control.idAlumno;
          const student = search(appContext.students, idStudent, 0, appContext.students.length);
          if (student && student.estado === 0) {
            tempBecas.push({
              id: student.id,
              matricula: student.matricula,
              nombre: `${student.nombres} ${student.pApellido} ${student.sApellido}`,
              grado: student.informacion.grado,
              grupo: student.informacion.grupo
            });
          }
          // tempBecas.push(control);
          break;
        }

        case 1: {
          // tempEnfermos.push(control);
          const idStudent = control.idAlumno;
          const student = search(appContext.students, idStudent, 0, appContext.students.length);
          if (student && student.estado === 0) {
            tempEnfermos.push({
              id: student.id,
              matricula: student.matricula,
              nombre: `${student.nombres} ${student.pApellido} ${student.sApellido}`,
              grado: student.informacion.grado,
              grupo: student.informacion.grupo
            });
          }
          break;
        }

        case 2: {
          const idStudent = control.idAlumno;
          const student = search(appContext.students, idStudent, 0, appContext.students.length);
          if (student && student.estado === 0) {
            tempVerBien.push({
              id: student.id,
              matricula: student.matricula,
              nombre: `${student.nombres} ${student.pApellido} ${student.sApellido}`,
              grado: student.informacion.grado,
              grupo: student.informacion.grupo
            });
          }
          break;
        }
        case 3: {
          const idStudent = control.idAlumno;
          const student = search(appContext.students, idStudent, 0, appContext.students.length);
          if (student && student.estado === 0) {
            tempSituacionEspecial.push({
              id: student.id,
              matricula: student.matricula,
              nombre: `${student.nombres} ${student.pApellido} ${student.sApellido}`,
              grado: student.informacion.grado,
              grupo: student.informacion.grupo
            });
          }
          break;
        }
        default:
          break;
      }

      console.log(tempBecas, tempEnfermos, tempVerBien, tempSituacionEspecial);


      setBecas(tempBecas);
      setEnfermos(tempEnfermos);
      setVerBien(tempVerBien);
      setSituacionEspecial(tempSituacionEspecial);

    }
    setLoading(false);

  }, [appContext.controls]);

  function search(array: any[], id: any, start: number, end: number): any {
    if (start > end) {
      return;
    }

    const middle = Math.floor((start + end) / 2);

    if (array[middle].id == id) {
      return array[middle];
    }

    if (array[middle].id > id) {
      return search(array, id, start, middle - 1);
    } else {
      return search(array, id, middle + 1, end);
    }
  }

  function addStudentDialog(type: number) {

  }

  if (redirectLogin) {
    return (
      <Navigate to='/login' />
    );
  }

  if (loading) {
    return (
      <div className='container'>
        <Header
          title='Controles'
          backButtonRoute='/' />
        <Breadcrumb
          crumbs={['Inicio', 'Controles']}
          routes={['/', '/controls']} />
      </div>
    )
  }

  return (
    <>
      <div className='container'>
        <Header
          title='Controles'
          backButtonRoute='/' />
        <Breadcrumb
          crumbs={['Inicio', 'Controles']}
          routes={['/', '/controls']} />
        <div className='c-body'>
          <TabPanel
            tabs={['Becas alimenticias', 'Ver bien para aprender mejor', 'Situación especial']}>
            <div className='control-container'>
              <Table
                informationRoute='/student'
                clickable={true}
                headers={headers}
                data={becas} />
              <div className='control-footer fade-in-up delay-7'>
                <button className='button-primary' type='button' onClick={() => { addStudentDialog(0) }}>Agregar estudiante</button>
              </div>
            </div>
            <div className='control-container'>
              <Table
                informationRoute='/student'
                clickable={true}
                headers={headers}
                data={verBien} />
              <div className='control-footer fade-in-up delay-7'>
                <button className='button-primary' type='button' onClick={() => { addStudentDialog(2); }}>Agregar estudiante</button>
              </div>
            </div>
            <div className='control-container'>
              <Table
                informationRoute='/student'
                clickable={true}
                headers={headers}
                data={situacionEspecial} />
              <div className='control-footer fade-in-up delay-7'>
                <button className='button-primary' type='button' onClick={() => { addStudentDialog(3); }}>Agregar estudiante</button>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
      <Dialog title='Agregar estudiante' visible={isDialogVisible}>

      </Dialog>
    </>
  );
};

export default Controls;
