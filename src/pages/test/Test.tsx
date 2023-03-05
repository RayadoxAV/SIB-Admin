import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { AppContext } from '../../State';

const Test: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  useEffect(() => {
    alert('holi');
  }, [appContext.settings]);

  function updateCount() {
    // const tempUsers = [];
    // setUsers(tempUsers);
    const count = appContext.count;
    dispatch({ type: 'setCount', count: count + 1 });
  }

  return (
    <div className='container'>
      <Header
        title='Test'
        backButtonRoute='/' />
      <button onClick={updateCount}>Add 1</button>
      <span>{appContext.count}</span>
    </div>
  );

};

export default Test;
