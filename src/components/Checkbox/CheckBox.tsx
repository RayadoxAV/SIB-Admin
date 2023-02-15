import React, { useState } from 'react';

import './CheckBox.css';

interface CheckBoxProps {
  label?: string;
  onChange?: Function;
  shouldTriState?: boolean;
};

const CheckBox: React.FC<CheckBoxProps> = ({ label, onChange, shouldTriState }) => {

  const [checked, setChecked] = useState(false);
  
  function handleClick() {
    const tempChecked = checked;
    setChecked(!tempChecked);
    
    if (onChange) {
      onChange(!tempChecked);
    }
  }

  return (
    <div className='checkbox-container' tabIndex={-1} onClick={handleClick}>
      <div className={`checkbox ${shouldTriState ? 'tristate' : checked ? 'checked' : ''}`}>
        {shouldTriState ? 
        (<i className='fa-solid fa-minus'></i>) :
        (checked ? 
          (<i className='fa-solid fa-check'></i>) :
          (null))}
        {/* {checked ?
        (<i className='fa-solid fa-check'></i>) : 
        (null)} */}
      </div>
      { label ? 
      (<span className='label'>{ label }</span>) :
      (null) }
    </div> 
  );
};

export default CheckBox;
