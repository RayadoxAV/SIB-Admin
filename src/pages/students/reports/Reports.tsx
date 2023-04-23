import React, { useContext, useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../../State';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { useDate } from '../../../hooks/useDate';
import { SERVER_IP, formatPerformance } from '../../../util/util';

import './Reports.css';
import { formatDate } from '../../../util/util';

const Reports: React.FC = () => {

  const { id } = useParams();

  const [appContext, _] = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [student, setStudent] = useState(undefined as any);
  const [reports, setReports] = useState([] as any[]);

  const date = useDate();

  useEffect(() => {
    setLoading(true);
    const students = appContext.students;

    if (students.length < 1) {
      setRedirect(true);
      return;
    }

    for (let i = 0; i < students.length; i++) {
      const tempStudent = students[i];
      if (tempStudent.id == id) {
        setStudent(tempStudent);
        setLoading(false);
        break;
      }
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/student/documents/${id}`, requestOptions).then((res) => res.json()).then((response) => {
      const queryDocuments = response.result;

      for (let i = 0; i < queryDocuments.length; i++) {
        let document = queryDocuments[i];
        const information = JSON.parse(document.informacion);
        document.informacion = information;

        queryDocuments[i] = document;
      }

      const tempReports = [];

      for (let i = 0; i < queryDocuments.length; i++) {
        const document = queryDocuments[i];

        if (document.tipo === 0) {
          tempReports.push(document);
        }
      }

      setLoading(false);
      setReports(tempReports);

    });
  }, []);

  if (redirect) {
    return (
      <Navigate to='/students' />
    );
  }


  if (loading) {
    return (
      <div className='container'>
        <Header
          title='Reportes'
          backButtonRoute={`/student/${id}`} />
        <div className='c-body' style={{ justifyContent: 'center' }}>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <Header
        title='Reportes'
        backButtonRoute={`/student/${id}`} />
      <Breadcrumb
        crumbs={['Inicio', 'Estudiantes', 'Estudiante', 'Reportes']}
        routes={['/', '/students', `/student/${id}`, `/student/reports/${id}`]} />
      <div className='c-body spaced'>
        <div className='report'>
          <div className='report-header'>
            <div className='identification'>
              <span className='name fade-in-up delay-3'>Lista de reportes</span>
              <span className='matricula fade-in-up delay-3'>{student.nombres} {student.pApellido} {student.sApellido} - Matrícula: {student.matricula}</span>
              <div className='grado-grupo fade-in-up delay-5'>
                <span className='grado'>Grado: {student.informacion.grado}°</span>
                <span className='grupo'>{student.informacion.grupo}</span>
              </div>
            </div>
            <span className='date fade-in-up delay-3'>{date}</span>
          </div>
        </div>
        <div className='report-body fade-in-up delay-5'>
          <div className='reports-container'>
            {reports.length < 1 ? 'Sin reportes registrados' : (
              reports.map((report, index) => (
                <div className='card' key={index}>
                  <div className='card-header'>
                    <span className='card-title'>Reporte del {formatDate(report.fecha)}</span>
                  </div>
                  <div className='card-body col' style={{ paddingBottom: '1rem' }}>
                    <div className='report-row'>
                      <span className='report-key'>Motivo</span>
                      <span className='report-value'>{report.informacion.motivoReporte}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Rendimiento académico</span>
                      <span className='report-value'>{formatPerformance(report.informacion.rendimientoAcademico)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Cumplimiento de tareas y trabajos</span>
                      <span className='report-value'>{formatPerformance(report.informacion.cumplimientoTareas)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Disciplina en el aula</span>
                      <span className='report-value'>{formatPerformance(report.informacion.disciplina)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Participación</span>
                      <span className='report-value'>{formatPerformance(report.informacion.participacion)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Atiende las explicaciones</span>
                      <span className='report-value'>{formatPerformance(report.informacion.atiendeExplicaciones)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Asistencia y puntualidad</span>
                      <span className='report-value'>{formatPerformance(report.informacion.asistencia)}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Profesor que reportó</span>
                      <span className='report-value'>{report.informacion.profesor}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Asignatura</span>
                      <span className='report-value'>{report.informacion.asignatura}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Comentarios del alumno</span>
                      <span className='report-value'>{report.informacion.comentarioAlumno}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Actitud del alumno</span>
                      <span className='report-value'>{report.informacion.actitud}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Fecha de entrevista con padres</span>
                      <span className='report-value'>{report.informacion.entrevistaPadresFecha || 'Sin asignar'}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Entrevista con padres</span>
                      <span className='report-value'>{report.informacion.entrevistaPadres || 'Sin asignar'}</span>
                    </div>
                    <div className='report-row'>
                      <span className='report-key'>Acuerdos y compromisos</span>
                      <span className='report-value'>{report.informacion.acuerdos}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
