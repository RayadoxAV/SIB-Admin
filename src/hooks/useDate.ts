import { useState, useEffect } from 'react';

export function useDate(): string {
  const [date, setDate] = useState(new Date()); 

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 5 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  let hours = date.getHours();
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursString = (hours < 10) ? `0${hours}` : hours;

  let minutes = date.getMinutes();
  const minutesString = (minutes < 10) ? `0${minutes}` : minutes;
  
  return `${hoursString}:${minutesString}`;
};
