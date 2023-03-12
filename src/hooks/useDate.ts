/* 
  Hooks personalizados para mostrar horas y fechas de manera periódica
*/
import { useState, useEffect } from 'react';

// Función que retorna un hook que actualiza la hora del día cada 5 segundos
export function useTime(): string {
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

// Función que retorna un hook que actualiza la fecha cada 15 minutos
export function useDate(): string {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 900 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const days = date.getDate();
  const months = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${days < 10 ? '0' : ''}${days}/${months < 10 ? '0' : ''}${months}/${year}`;
}