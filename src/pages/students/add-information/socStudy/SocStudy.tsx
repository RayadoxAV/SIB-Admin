import React, { useRef, useState } from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import FormError from '../../../../components/form-error/FormError';
import { useDate } from '../../../../hooks/useDate';
import { SERVER_IP } from '../../../../util/util';
import Select from 'react-select';
import { selectStyle } from '../../../../util/reactSelectStyle';
import { useNavigate } from 'react-router-dom';

interface SocStudyProps {
  student: any;
  onSuccess: Function;
};

const estadoCivilOptions = [
  { value: '0', label: 'Soltero(a)' },
  { value: '1', label: 'Casado(a)' },
  { value: '2', label: 'Unión libre' }
];

const escolaridadOptions = [
  { value: '0', label: 'Primaria' },
  { value: '1', label: 'Secundaria' },
  { value: '2', label: 'Bachillerato' },
  { value: '3', label: 'Licenciatura' },
  { value: '4', label: 'Posgrado' }
];


const egresos: any = {
  alimentacion: 0,
  medicamentos: 0,
  transporte: 0,
  gasolina: 0,
  educacion: 0,
  abono: 0,
  celulares: 0,
  servicioMedico: 0,
  guarderia: 0,
  agua: 0,
  gasCilindro: 0,
  energiaElectrica: 0,
  telefonoInternet: 0,
  cable: 0,
  otros: 0
};

const SocStudy: React.FC<SocStudyProps> = ({ student, onSuccess }) => {

  const date = useDate();
  const ref = useRef(undefined as any);
  const form = useRef(undefined as any);

  const [members, setMembers] = useState([] as any);

  const [cantidad, setCantidad] = useState(-1);
  const [tipoFamilia, setTipoFamilia] = useState(-1);
  const [estadoVivienda, setEstadoVivienda] = useState(-1);
  const [materialVivienda, setMaterialVivienda] = useState(-1);
  const [totalEgresos, setTotalEgresos] = useState(0);

  const navigate = useNavigate();

  const initialValues = {
    tipoFamilia: '',
    cantidadMiembros: '',
    totalMiembrosTrabajan: 0,
    alimentacion: 0,
    medicamentos: 0,
    transporte: 0,
    gasolina: 0,
    educacion: 0,
    abono: 0,
    celulares: 0,
    servicioMedico: 0,
    guarderia: 0,
    agua: 0,
    gasCilindro: 0,
    energiaElectrica: 0,
    telefonoInternet: 0,
    cable: 0,
    otros: 0,
    totalEgresos: 0,
    estadoVivienda: '',
    materialVivienda: ''
  };

  const validationSchema = Yup.object({
    tipoFamilia: Yup.string().required('Seleccione un tipo de familia'),
    cantidadMiembros: Yup.string().required('Seleccione una cantidad de miembros'),
    totalMiembrosTrabajan: Yup.number().required('Ingrese la cantidad de miembros').min(0, 'Escriba una cantidad válida'),
    alimentacion: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    medicamentos: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    transporte: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    gasolina: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    educacion: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    abono: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    celulares: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    servicioMedico: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    guarderia: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    gasCilindro: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    agua: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    energiaElectrica: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    telefonoInternet: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    cable: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    otros: Yup.number().required('Ingrese un número').min(0, 'Ingrese una cantidad válida'),
    totalEgresos: Yup.number(),
    estadoVivienda: Yup.string().required('Seleccione un estado de vivienda'),
    materialVivienda: Yup.string().required('Seleccione un material de vivienda')
  });

  function handleSubmit(values: any, { resetForm }: any) {
    console.log(values);
    values.miembrosFamilia = members;

    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    fetch(`${SERVER_IP}/students/add-soc-study/${student.id}`, requestOptions).then((res) => res.json()).then((response) => {
      if (response.requestStatus === 'SUCCESS' && response.updateStatusCode === 0) {
        onSuccess();
        resetForm();
      } else if (response.requestStatus === 'ERROR') {
        console.log(response.error);
      }
    });
  }

  const initialMemberValues = {
    nombre: '',
    edad: 0,
    parentesco: '',
    estadoCivil: '0',
    escolaridad: '0',
    ocupacion: '',
    empresa: '',
    ingreso: 0,
    aporte: 0,
    emergencia: false,
    telefono: ''
  };

  const memberValidationSchema = Yup.object({
    nombre: Yup.string().required('Ingrese un nombre'),
    edad: Yup.number().required('Ingrese un número').min(0, 'La edad no puede ser negativa').max(100, 'Si tiene más de 100 ya no hay mucha diferencia'),
    parentesco: Yup.string().required('Ingrese el parentesco'),
    estadoCivil: Yup.string().required('Ingrese el estado civil'),
    escolaridad: Yup.string().required('Ingrese la escolaridad'),
    ocupacion: Yup.string().required('Ingrese una ocupación'),
    empresa: Yup.string().notRequired(),
    ingreso: Yup.number().required('Ingrese un número').min(0, 'El ingreso no puede ser negativo'),
    aporte: Yup.number().required('Ingresa un número').min(0, 'El aporte no puede ser negativo'),
    emergencia: Yup.boolean(),
    telefono: Yup.string().matches(/^[0-9]{10}$/, 'Escribe un teléfono válido'),
  });

  function handleMemberSubmit(values: any, { resetForm }: any) {
    const member = {
      nombreMiembro: values.nombre,
      edadMiembro: values.edad,
      parentescoMiembro: values.parentesco,
      estadoCivilMiembro: values.estadoCivil,
      escolaridadMiembro: values.escolaridad,
      ocupacionMiembro: values.ocupacion,
      empresaMiembro: values.empresa,
      ingresoMiembro: values.ingreso,
      aporteMiembro: values.aporte,
      telefonoMiembro: values.telefono,
      emergenciaMiembro: values.emergencia
    };

    const tempMembers = [...members];

    tempMembers.push(member);

    setMembers(tempMembers);
    resetForm();
    closeAddMemberDialog();
  }

  function openAddMemberDialog() {
    ref.current.showModal();
  }

  function closeAddMemberDialog() {
    ref.current.close();
  }

  function deleteMember(i: number) {
    const tempMembers = [...members];

    tempMembers.splice(i, 1);

    setMembers(tempMembers);
  }

  function handleCantidadMiembros(cantidad: string) {
    if (cantidad === 'pequena') {
      setCantidad(0);
      return;
    }

    if (cantidad === 'numerosa') {
      setCantidad(1);
      return;
    }
  }

  function handleTipoFamilia(tipo: string) {
    if (tipo === 'mixta') {
      setTipoFamilia(0);
      return;
    }

    if (tipo === 'integrada') {
      setTipoFamilia(1);
      return;
    }

    if (tipo === 'desintegrada') {
      setTipoFamilia(2);
      return;
    }
  }


  function handleEstadoVivienda(estado: string) {
    if (estado === 'propia') {
      setEstadoVivienda(0);
      return;
    }

    if (estado === 'rentada') {
      setEstadoVivienda(1);
      return;
    }

    if (estado === 'prestada') {
      setEstadoVivienda(2);
      return;
    }

    if (estado === 'pagandose') {
      setEstadoVivienda(3);
      return;
    }
  }

  function handleMaterialVivienda(material: string) {
    if (material === 'adobe') {
      setMaterialVivienda(0);
      return;
    }

    if (material === 'ladrillo') {
      setMaterialVivienda(1);
      return;
    }

    if (material === 'block') {
      setMaterialVivienda(2);
      return;
    }

    if (material === 'madera') {
      setMaterialVivienda(3);
      return;
    }
  }

  function calculateEgresos(id: string, value: any) {
    if (value) {
      const numericValue = Number.parseFloat(value);
      if (numericValue > 0) {
        egresos[id] = numericValue;
      } else {
        egresos[id] = 0;
      }
    } else {
      egresos[id] = 0;
    }

    let total = 0;

    for (const [key, value] of Object.entries(egresos)) {
      total += Number.parseFloat(value as any);
    }

    setTotalEgresos(total);
    form.current.setFieldValue('totalEgresos', total);
  }

  return (
    <>
      <div className='soc-study'>
        <div className='soc-study-header'>
          <div className='identification'>
            <span className='name fade-in-up delay-3'>{student.nombres} {student.pApellido} {student.sApellido}</span>
            <span className='matricula fade-in-up delay-3'>Matrícula: {student.matricula}</span>
            <div className='grado-grupo fade-in-up delay-5'>
              <span className='grado'>Grado: {student.informacion.grado}°</span>
              <span className='grupo'>{student.informacion.grupo}</span>
            </div>
          </div>
          <span className='date fade-in-up delay-3'>{date}</span>
        </div>
        <div className='soc-study-body fade-in-up delay-5' style={{ opacity: '0' }}>
          <Formik
            innerRef={form}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className='form'>
                <div className='soc-study-form fade-in-up delay-5'>
                  <span className='form-title'>Información familiar</span>
                  <div className='divider'></div>
                  <div className='col-2'>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <button type='button' className='button-text' onClick={openAddMemberDialog}>Agregar miembro</button>
                    </div>
                    <div className='members'>
                      <span className='form-subtitle'>Miembros</span>
                      {members.map((member: any, index: number) => (
                        <div className={`family-member ${member.emergenciaMiembro ? 'emergency' : ''}`} key={index}>
                          <div className='information'>
                            <span className='name'>{member.nombreMiembro}</span>
                            <div className='data'>
                              <span className='value border'>{member.parentescoMiembro}</span>
                              <span className='value border'>{member.ocupacionMiembro}</span>
                              <span className='value'>{member.edadMiembro} años</span>
                            </div>
                            {member.emergenciaMiembro ?
                              (
                                <span className='emergency'>Contacto de emergencia
                                  <i className='fa-solid fa-kit-medical'></i>
                                </span>
                              ) : null}
                          </div>
                          <button className='delete' type='button' onClick={() => { deleteMember(index) }}>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className='form-title'>Tipo de familia</span>
                  <div className='divider'></div>
                  <div className='family-type'>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div className='type'>
                        <button type='button' className={`segmented-button ${cantidad === 0 ? 'active' : ''}`} onClick={() => { handleCantidadMiembros('pequena'); setFieldValue('cantidadMiembros', 'pequena') }}>Pequeña</button>
                        <button type='button' className={`segmented-button ${cantidad === 1 ? 'active' : ''}`} onClick={() => { handleCantidadMiembros('numerosa'); setFieldValue('cantidadMiembros', 'numerosa') }}>Numerosa</button>
                      </div>
                      <FormError text={errors.cantidadMiembros} touched={touched.cantidadMiembros} />
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div className='type'>
                        <button type='button' className={`segmented-button ${tipoFamilia === 0 ? 'active' : ''}`} onClick={() => { handleTipoFamilia('mixta'); setFieldValue('tipoFamilia', 'mixta') }}>Mixta</button>
                        <button type='button' className={`segmented-button ${tipoFamilia === 1 ? 'active' : ''}`} onClick={() => { handleTipoFamilia('integrada'); setFieldValue('tipoFamilia', 'integrada') }}>Integrada</button>
                        <button type='button' className={`segmented-button ${tipoFamilia === 2 ? 'active' : ''}`} onClick={() => { handleTipoFamilia('desintegrada'); setFieldValue('tipoFamilia', 'desintegrada') }}>Desintegrada</button>
                      </div>
                      <FormError text={errors.tipoFamilia} touched={touched.tipoFamilia} />
                    </div>
                  </div>
                  <div className='input-column'>
                    <span className='input-label'>Total de miembros que trabajan</span>
                    <input id='totalMiembrosTrabajan' name='totalMiembrosTrabajan' type='number' className='input' onChange={handleChange} onBlur={handleBlur} value={values.totalMiembrosTrabajan} />
                    <FormError text={errors.totalMiembrosTrabajan} touched={touched.totalMiembrosTrabajan} />
                  </div>
                  <div className='form-title'>Egresos familiares</div>
                  <div className='divider'></div>
                  <div className='expenses'>
                    <div className='input-row'>
                      <span className='label'>Alimentación</span>
                      <div className='col'>
                        <input id='alimentacion' name='alimentacion' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.alimentacion} />
                        <FormError text={errors.alimentacion} touched={touched.alimentacion} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Medicamentos</span>
                      <div className='col'>
                        <input id='medicamentos' name='medicamentos' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.medicamentos} />
                        <FormError text={errors.medicamentos} touched={touched.medicamentos} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Transporte</span>
                      <div className='col'>
                        <input id='transporte' name='transporte' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.transporte} />
                        <FormError text={errors.transporte} touched={touched.transporte} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Gasolina</span>
                      <div className='col'>
                        <input id='gasolina' name='gasolina' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.gasolina} />
                        <FormError text={errors.gasolina} touched={touched.gasolina} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Educación</span>
                      <div className='col'>
                        <input id='educacion' name='educacion' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.educacion} />
                        <FormError text={errors.educacion} touched={touched.educacion} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Abono</span>
                      <div className='col'>
                        <input id='abono' name='abono' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.abono} />
                        <FormError text={errors.abono} touched={touched.abono} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Celulares</span>
                      <div className='col'>
                        <input id='celulares' name='celulares' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.celulares} />
                        <FormError text={errors.celulares} touched={touched.celulares} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Servicio médico</span>
                      <div className='col'>
                        <input id='servicioMedico' name='servicioMedico' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.servicioMedico} />
                        <FormError text={errors.servicioMedico} touched={touched.servicioMedico} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Guardería</span>
                      <div className='col'>
                        <input id='guarderia' name='guarderia' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.guarderia} />
                        <FormError text={errors.guarderia} touched={touched.guarderia} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Agua</span>
                      <div className='col'>
                        <input id='agua' name='agua' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.agua} />
                        <FormError text={errors.agua} touched={touched.agua} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Gas cilindro</span>
                      <div className='col'>
                        <input id='gasCilindro' name='gasCilindro' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.gasCilindro} />
                        <FormError text={errors.gasCilindro} touched={touched.gasCilindro} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Energía eléctrica</span>
                      <div className='col'>
                        <input id='energiaElectrica' name='energiaElectrica' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.energiaElectrica} />
                        <FormError text={errors.energiaElectrica} touched={touched.energiaElectrica} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Teléfono / Internet</span>
                      <div className='col'>
                        <input id='telefonoInternet' name='telefonoInternet' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.telefonoInternet} />
                        <FormError text={errors.telefonoInternet} touched={touched.telefonoInternet} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Cable</span>
                      <div className='col'>
                        <input id='cable' name='cable' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.cable} />
                        <FormError text={errors.cable} touched={touched.cable} />
                      </div>
                    </div>
                    <div className='input-row'>
                      <span className='label'>Otros</span>
                      <div className='col'>
                        <input id='otros' name='otros' type='number' className='input' onChange={(event) => { calculateEgresos(event.currentTarget.id, event.target.value); handleChange(event); }} onBlur={handleBlur} value={values.otros} />
                        <FormError text={errors.otros} touched={touched.otros} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '18px' }}>Total de egresos familiares ${totalEgresos.toFixed(2)}</span>
                    </div>
                    <input id='totalEgresos' name='totalEgresos' type='number' value={values.totalEgresos} readOnly={true} hidden={true} />
                  </div>
                  <div className='form-title'>Características de la vivienda</div>
                  <div className='divider'></div>
                  <div className='family-type'>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div className='type'>
                        <button type='button' className={`segmented-button ${estadoVivienda === 0 ? 'active' : ''}`} onClick={() => { handleEstadoVivienda('propia'); setFieldValue('estadoVivienda', 'propia') }}>Propia</button>
                        <button type='button' className={`segmented-button ${estadoVivienda === 1 ? 'active' : ''}`} onClick={() => { handleEstadoVivienda('rentada'); setFieldValue('estadoVivienda', 'rentada') }}>Rentada</button>
                        <button type='button' className={`segmented-button ${estadoVivienda === 2 ? 'active' : ''}`} onClick={() => { handleEstadoVivienda('prestada'); setFieldValue('estadoVivienda', 'prestada') }}>Prestada</button>
                        <button type='button' className={`segmented-button ${estadoVivienda === 3 ? 'active' : ''}`} onClick={() => { handleEstadoVivienda('pagandose'); setFieldValue('estadoVivienda', 'pagandose') }}>Pagándose</button>
                      </div>
                      <FormError text={errors.estadoVivienda} touched={touched.estadoVivienda} />
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div className='type'>
                        <button type='button' className={`segmented-button ${materialVivienda === 0 ? 'active' : ''}`} onClick={() => { handleMaterialVivienda('adobe'); setFieldValue('materialVivienda', 'adobe') }}>Adobe</button>
                        <button type='button' className={`segmented-button ${materialVivienda === 1 ? 'active' : ''}`} onClick={() => { handleMaterialVivienda('ladrillo'); setFieldValue('materialVivienda', 'ladrillo') }}>Ladrillo</button>
                        <button type='button' className={`segmented-button ${materialVivienda === 2 ? 'active' : ''}`} onClick={() => { handleMaterialVivienda('block'); setFieldValue('materialVivienda', 'block') }}>Block</button>
                        <button type='button' className={`segmented-button ${materialVivienda === 3 ? 'active' : ''}`} onClick={() => { handleMaterialVivienda('madera'); setFieldValue('materialVivienda', 'madera') }}>Madera</button>
                      </div>
                      <FormError text={errors.materialVivienda} touched={touched.materialVivienda} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className='button-primary' style={{ minWidth: '10rem' }} type='submit'>Aceptar</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <dialog className='add-member-dialog' ref={ref}>
        <div className='modal-header'>
          <span className='modal-title'>Agregar miembro</span>
          <button className='button-close' onClick={closeAddMemberDialog}>
            <i className='fa-solid fa-close'></i>
          </button>
        </div>
        <Formik
          initialValues={initialMemberValues}
          validationSchema={memberValidationSchema}
          onSubmit={handleMemberSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form className='modal-body'>
              <div className='input-column'>
                <span className='input-label'>Nombre</span>
                <input id='nombre' name='nombre' type='text' value={values.nombre} onChange={handleChange} onBlur={handleBlur} className='input' />
                <FormError text={errors.nombre} touched={touched.nombre} />
              </div>
              <div className='form-split'>
                <div className='input-column'>
                  <span className='input-label'>Edad</span>
                  <input id='edad' name='edad' type='number' value={values.edad} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.edad} touched={touched.edad} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Parentesco</span>
                  <input id='parentesco' name='parentesco' type='text' value={values.parentesco} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.parentesco} touched={touched.parentesco} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Estado civil</span>
                  <Select
                    id='estadoCivil'
                    name='estadoCivil'
                    className='react-select'
                    required={true}
                    styles={selectStyle}
                    options={estadoCivilOptions}
                    value={estadoCivilOptions.find(option => option.value === values.estadoCivil)}
                    onChange={(option: any) => {
                      setFieldValue('estadoCivil', `${option.value}`);
                    }}
                    onBlur={handleBlur} />
                  <FormError text={errors.estadoCivil} touched={touched.estadoCivil} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Escolaridad</span>
                  <Select
                    id='escolaridad'
                    name='escolaridad'
                    className='react-select'
                    required={true}
                    styles={selectStyle}
                    options={escolaridadOptions}
                    value={escolaridadOptions.find(option => option.value === values.escolaridad)}
                    onChange={(option: any) => {
                      setFieldValue('escolaridad', `${option.value}`);
                    }}
                    onBlur={handleBlur} />
                  <FormError text={errors.escolaridad} touched={touched.escolaridad} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Ocupación</span>
                  <input id='ocupacion' name='ocupacion' type='text' value={values.ocupacion} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.ocupacion} touched={touched.ocupacion} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Empresa <small>&#40;Opcional&#41;</small></span>
                  <input id='empresa' name='empresa' type='text' value={values.empresa} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.empresa} touched={touched.empresa} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Ingreso mensual</span>
                  <input id='ingreso' name='ingreso' type='number' value={values.ingreso} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.ingreso} touched={touched.ingreso} />
                </div>
                <div className='input-column'>
                  <span className='input-label'>Aporte al ingreso familiar</span>
                  <input id='aporte' name='aporte' type='number' value={values.aporte} onChange={handleChange} onBlur={handleBlur} className='input' />
                  <FormError text={errors.aporte} touched={touched.aporte} />
                </div>
              </div>
              <div className='input-column'>
                <span className='input-label'>Teléfono <small>&#40;Opcional&#41;</small></span>
                <input id='telefono' name='telefono' type='text' value={values.telefono} onChange={handleChange} onBlur={handleBlur} className='input' />
                <FormError text={errors.telefono} touched={touched.telefono} />
              </div>
              <div className='input-row' style={{ justifyContent: 'center' }}>
                <input id='emergencia' name='emergencia' type='checkbox' value={`${values.emergencia}`} onChange={handleChange} onBlur={handleBlur} />
                <span className='input-label'>Contacto de emergencia</span>
              </div>
              <div className='input-row' style={{ justifyContent: 'center' }}>
                <button className='button-primary' type='submit'>Aceptar</button>
              </div>
            </Form>
          )}
        </Formik>
      </dialog>
    </>
  );
}

export default SocStudy;
