import React from 'react';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const Controls: React.FC = () => {
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

        </TabPanel>
      </div>
    </div>
  );
};

export default Controls;
