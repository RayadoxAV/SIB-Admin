import * as Yup from 'yup'; 

export const reportPerformanceOptions = [
  { value: '0', label: 'Excelente' },
  { value: '1', label: 'Bueno' },
  { value: '2', label: 'Regular' },
  { value: '3', label: 'Malo' }
];

export interface ReportValues {
  motivoReporte: string;
  rendimientoAcademico: string;
  cumplimientoTareas: string;
  disciplina: string;
  participacion: string;
  atiendeExplicaciones: string;
  asistencia: string;
  profesor: string;
  asignatura: string;
  comentarioAlumno: string;
  actitud: string;
  entrevistaPadresFecha: string;
  entrevistaPadres: string;
  acuerdos: string;
};

export const reportInitialValues = {
  motivoReporte: '',
  rendimientoAcademico: '1',
  cumplimientoTareas: '1',
  disciplina: '1',
  participacion: '1',
  atiendeExplicaciones: '1',
  asistencia: '1',
  profesor: '',
  asignatura: '',
  comentarioAlumno: '',
  actitud: '',
  entrevistaPadresFecha: '',
  entrevistaPadres: '',
  acuerdos: ''
};

export const reportValidationSchema = Yup.object({
  motivoReporte: Yup.string().required('Introduzca un motivo para el reporte'),
  rendimientoAcademico: Yup.string().required('Seleccione un nivel de desempeño'),
  cumplimientoTareas: Yup.string().required('Seleccione un nivel de desempeño'),
  disciplina: Yup.string().required('Seleccione un nivel de desempeño'),
  participacion: Yup.string().required('Seleccione un nivel de desempeño'),
  atiendeExplicaciones: Yup.string().required('Seleccione un nivel de desempeño'),
  asistencia: Yup.string().required('Seleccione un nivel de desempeño'),
  profesor: Yup.string().required('Introduzca el nombre del profesor'),
  asignatura: Yup.string().required('Introduzca una asignatura'),
  comentarioAlumno: Yup.string().required('Introduzca el comentario del alumno (a)'),
  actitud: Yup.string().required('Describa la actitud del alumno'),
  entrevistaPadresFecha: Yup.date(),
  entrevistaPadres: Yup.string(),
  acuerdos: Yup.string().required('Escriba los acuerdos')
});


export interface GradeValues {
  asignatura: string;
  calificacion: number;
};

export const gradeInitialValues = {
  asignatura: '',
  calificacion: 0,
};

export const gradeValidationSchema = Yup.object({
  asignatura: Yup.string().required('Introduzca el nombre de la asignatura'),
  calificacion: Yup.number().required('Introduzca la calificación').min(0, 'El mínimo es cero').max(10, 'El máximo es diez'),
});
