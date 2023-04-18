import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Breadcrumb.css';

interface BreadcrumbProps {
  crumbs: string[];
  routes: string[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs, routes }) => {

  const navigate = useNavigate();

  function handleClick(index: number) {
    if (index < routes.length - 1) {
      navigate(routes[index]);
    }
  }

  return (
    <div className='breadcrumb fade-in-up'>
      {
        crumbs.map((crumb: string, index: number) => (
          <button key={index} className={`crumb ${index === crumbs.length - 1 ? 'active' : ''}`} onClick={() => { handleClick(index) }}>
            {crumb}
            &nbsp;
            {index < crumbs.length - 1 ? (
              <span className='separator'>
                <i className='fa-solid fa-chevron-right'></i>
              </span>
            ) :
            (
              null
            )}
          </button>
        ))
      }
    </div>
  );
};

export default Breadcrumb;
