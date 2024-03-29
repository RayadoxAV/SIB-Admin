import React from 'react';

import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
  text: string;
  icon: string;
  route?: string;
  className?: string;
  requiredRole?: number;
  userRole?: number;
};

const MenuItem: React.FC<MenuItemProps> = ({ text, icon, route, className, requiredRole = 5, userRole = 5 }) => {
  const navigate = useNavigate();

  // Navegar a la ruta especificada por el Menu
  function onClick() {
    if (route) {
      navigate(`${route}`);
    }
  }

  return (

    (userRole <= requiredRole) ?
      (
        <div className={`menu-item ${className}`} onClick={onClick}>
          <i className={`fa-solid ${icon} icon`}></i>
          <div className='information'>
            <span className='title'>{text}</span>
          </div>
        </div>
      ) : (
        null
      )

  )
};

export default MenuItem;
