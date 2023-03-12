import React from 'react';
import Header from '../../components/Header/Header';
import TabPanel from '../../components/TabPanel/TabPanel';

const Controls: React.FC = () => {
  return (
    <div className='container'>
      <Header
        title='Controles'
        backButtonRoute='/' />
      <div className='c-body'>
        <TabPanel
          tabs={['Becas alimenticias', 'Enfermos', 'Ver bien', 'Situación especial']}>

        </TabPanel>
      </div>
    </div>
  );
};

export default Controls;
