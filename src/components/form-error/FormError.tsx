import React from 'react';

interface FormErrorProps {
  text?: string;
  touched?: boolean;
}

const FormError: React.FC<FormErrorProps> = ({ text, touched }) => {
  return (
    <span className='form-error'>{ (text && touched) ? text : '\u00A0' }</span>
  );
};

export default FormError;
