import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { AppContext } from '../../State';
import { SERVER_IP } from '../../util/util';
import { Navigate } from 'react-router-dom';
import Table from '../../components/table/Table';

const Controls: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  const [controls, setControls] = useState([]);
  const [becas, setBecas] = useState([] as any[]);
  const [enfermos, setEnfermos] = useState([] as any[]);
  const [verBien, setVerBien] = useState([] as any[]);
  const [situacionEspecial, setSituacionEspecial] = useState([] as any[]);


  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    console.log(appContext);
    // TODO: Change this to use sockets
    if (appContext.controls.length === 0) {
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

      fetch(`${SERVER_IP}/controls`, requestOptions).then((res) => res.json()).then((response) => {
        if (response.queryStatusCode === 0) {
          const queryControls = response.result;

          dispatch({ type: 'setControls', controls: queryControls });
          setControls(queryControls);

          const tempBecas = [];
          const tempEnfermos = [];
          const tempVerBien = [];
          const tempSituacionEspecial = [];

          for (let i = 0; i < queryControls.length; i++) {
            const control = queryControls[i];

            switch (control.tipoControl) {
              case 0:
                tempBecas.push(control);
                break;

              case 1:
                tempEnfermos.push(control);
                break;

              case 2:
                tempVerBien.push(control);
                break;

              case 3:
                tempSituacionEspecial.push(control);
                break;

              default:
                break;
            }
          }
          // setBecas(tempBecas);
          // setEnfermos(tempEnfermos);
          // setVerBien(tempVerBien);
          // setSituacionEspecial(tempSituacionEspecial);
          // setLoading(false);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      setControls(appContext.controls);

      const tempBecas = [];
      const tempEnfermos = [];
      const tempVerBien = [];
      const tempSituacionEspecial = [];

      for (let i = 0; i < appContext.controls.length; i++) {
        const control = appContext.controls[i];

        switch (control.tipoControl) {
          case 0:
            tempBecas.push(control);
            break;

          case 1:
            tempEnfermos.push(control);
            break;

          case 2:
            tempVerBien.push(control);
            break;

          case 3:
            tempSituacionEspecial.push(control);
            break;

          default:
            break;
        }
      }

      setBecas(tempBecas);
      setEnfermos(tempEnfermos);
      setVerBien(tempVerBien);
      setSituacionEspecial(tempSituacionEspecial);
      setLoading(false);

    }
  }, []);

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
    <div className='container'>
      <Header
        title='Controles'
        backButtonRoute='/' />
      <Breadcrumb
        crumbs={['Inicio', 'Controles']}
        routes={['/', '/controls']} />
      <div className='c-body'>
        <TabPanel
          tabs={['Becas alimenticias', 'Control de enfermos', 'Ver bien para aprender mejor', 'Situación especial']}>
          <div></div>
          <div></div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Controls;
