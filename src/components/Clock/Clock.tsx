import React from 'react';
import { useTime } from '../../hooks/useDate';

interface ClockProps {
  className?: string;
};

const Clock: React.FC<ClockProps> = ({ className }) => {
  const date = useTime();

  return (
    <span className={`clock ${className}`}>{date}</span>
  );
};

export default Clock;
