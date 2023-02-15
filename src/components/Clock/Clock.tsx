import React from 'react';
import { useDate } from '../../hooks/useDate';

interface ClockProps {
  className?: string;
};

const Clock: React.FC<ClockProps> = ({ className }) => {
  const date = useDate();

  return (
    <span className={`clock ${className}`}>{date}</span>
  );
};

export default Clock;
