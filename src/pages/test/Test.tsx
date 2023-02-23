import React, { useEffect, useState } from 'react';

const Test: React.FC = () => {

  const [users, setUsers] = useState([] as any);

  useEffect(() => {
    const tempUsers = [1, 2, 3, 4];
    setUsers(tempUsers);
  }, []);

  function deleteUsers() {
    // const tempUsers = [];
    // setUsers(tempUsers);
  }

  return (
    <div>
      <button onClick={deleteUsers}>hola</button>
      {users.map((user: any, index: number) => (
        <div key={index}>hola</div>
      ))}
    </div>
  );

};

export default Test;
