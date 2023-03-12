import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { format, formatDate, formatoEscolaridad, formatoEstadoCivil } from './util';

export function printStudent(student: any, documents: any) {


  function generateFamily() {
    const miembros = [];

    for (let i = 0; i < student.miembrosFamilia.length; i++) {
      const miembro = student.miembrosFamilia[i];


      miembros.push(
        [
          {
            text: `${miembro.nombreMiembro}`,
            style: 'bold'
          },
          {
            columns: [
              {
                text: `Parentesco`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${miembro.parentescoMiembro}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Edad`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${miembro.edadMiembro} años`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Estado civil`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${formatoEstadoCivil(miembro.estadoCivilMiembro)}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Escolaridad`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${formatoEscolaridad(miembro.escolaridadMiembro)}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Ocupación`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${miembro.ocupacionMiembro}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Empresa`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${miembro.empresaMiembro ? miembro.empresaMiembro : ''}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Ingreso mensual`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${Intl.NumberFormat('en-US').format(miembro.ingresoMiembro)}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `Aporte al ingreso`,
                alignment: 'left',
                width: '30%',
                style: 'key'
              },
              {
                text: `${Intl.NumberFormat('en-US').format(miembro.aporteMiembro)}`,
                alignment: 'right',
                style: 'value'
              }
            ]
          },
          {
            text: `${miembro.emergenciaMiembro ? 'Contacto de emergencia' : ''}`,
            style: 'danger',
            margin: [0, 0, 0, 12]
          }
        ]
      );
    }
    return miembros;
  }

  function generateGrades(documents: any) {
    const grades = [];
    for (let i = 0; i < documents.length; i++) {

      const document = documents[i];
      if (document.tipo === 1) {
        for (let j = 0; j < document.informacion.length; j++) {
          grades.push(
            {
              columns: [
                {
                  text: `${document.informacion[j].asignatura}`,
                  alignment: 'left',
                  width: '30%',
                  style: 'key'
                },
                {
                  text: `${document.informacion[j].calificacion}`,
                  alignment: 'right',
                  style: 'value'
                }
              ]
            }
          );
        }
      }
    }

    if (grades.length === 0) {
      grades.push({
        text: 'Sin calificaciones registradas'
      });
    }

    return grades;
  }

  function generateReports(documents: any) {
    const reports = [];

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];

      if (document.tipo === 0) {
        reports.push(
          [
            {
              columns: [
                {
                  text: 'Motivo',
                  width: '30%',
                  aligment: 'left',
                  style: 'key'
                },
                {
                  text: `${document.informacion.motivoReporte}`,
                  alignment: 'right',
                  style: 'value'
                }
              ]
            },
            {
              columns: [
                {
                  text: 'Profesor',
                  width: '30%',
                  alignment: 'left',
                  style: 'key'
                },
                {
                  text: `${document.informacion.profesor}`,
                  alignment: 'right',
                  style: 'value'
                }
              ]
            },
            {
              columns: [
                {
                  text: 'Asignatura',
                  width: '30%',
                  aligment: 'left',
                  style: 'key'
                },
                {
                  text: `${document.informacion.asignatura}`,
                  alignment: 'right',
                  style: 'value'
                }
              ]
            },
            {
              columns: [
                {
                  text: 'Fecha',
                  width: '30%',
                  alignment: 'left',
                  style: 'key'
                },
                {
                  text: `${formatDate(document.fecha)}`,
                  alignment: 'right',
                  style: 'value'
                }
              ]
            }
          ]
        );
      }
    }

    if (reports.length === 0) {
      reports.push({
        text: 'Sin reportes asignados'
      });
    }

    return reports;
  }

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      italics: 'Roboto-Italic.ttf',
      bold: 'Roboto-Medium.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    RobotoBold: {
      normal: 'http://localhost:1420/fonts/roboto/Roboto-Bold.ttf',
      bold: 'http://localhost:1420/fonts/roboto/Roboto-Black.ttf'
    }
  };

  const docDefinition = {
    content: [
      {
        text: `${student.nombre}`,
        style: 'title'
      },
      {
        text: `Matrícula: ${student.matricula}`,
        style: 'subtitle'
      },
      {
        text: `Grado: ${student.grado} - Grupo: ${student.grupo}`,
      },
      {
        text: 'Información personal',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      {
        canvas:
          [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
        margin: [0, 0, 0, 4]
      },
      {
        columns: [
          {
            text: 'CURP',
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `${student.CURP}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Fecha de nacimiento',
            width: '30%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${formatDate(student.fechaNac)}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Dirección',
            width: '20%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${student.direccion}, ${student.colonia}, ${student.localidad}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Teléfono',
            width: '20%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${student.telefono}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        text: 'Información escolar',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      {
        canvas:
          [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
        margin: [0, 0, 0, 4]
      },
      {
        text: 'Calificaciones',
        style: 'subheader'
      },
      ...generateGrades(documents),
      {
        text: 'Reportes',
        style: 'subheader',
        margin: [0, 8, 0, 8]
      },
      ...generateReports(documents),
      {
        text: 'Información familiar',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      {
        canvas:
          [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
        margin: [0, 0, 0, 4]
      },
      ...generateFamily(),
      {
        text: 'Tipo de familia',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      {
        canvas:
          [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
        margin: [0, 0, 0, 4]
      },
      {
        columns: [
          {
            text: 'Tamaño',
            width: '20%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${format(student.cantidadMiembros)}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Tipo',
            width: '20%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${format(student.tipoFamilia)}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Cantidad de miembros',
            width: '30%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${student.miembrosFamilia.length + 1} miembros`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        columns: [
          {
            text: 'Cantidad de miembros que trabajan',
            width: '40%',
            alignment: 'left',
            style: 'key'
          },
          {
            text: `${student.totalMiembrosTrabajan} miembros`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
      {
        text: 'Información socioeconómica',
        style: 'header',
        margin: [0, 12, 0, 4],
        pageBreak: 'before'
      },
      {
        canvas:
          [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
        margin: [0, 0, 0, 4]
      },
      {
        text: 'Egresos familiares',
        style: 'subheader',
        margin: [0, 8, 0, 8]
      },
      {
        columns: [
          {
            text: `Alimentación`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.alimentacion)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Medicamentos`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.medicamentos)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Transporte`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.transporte)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Gasolina`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.gasolina)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Educación`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.educacion)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Abono`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.abono)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Celulares`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.celulares)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Servicio médico`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.servicioMedico)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Agua`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.agua)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Gas cilíndro`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.gasCilindro)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Energía eléctrica`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.energiaElectrica)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Teléfono / Internet`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.telefonoInternet)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Cable`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.cable)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Otros`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.otros)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Total de egresos`,
            alignment: 'left',
            width: '30%',
            style: 'key'
          },
          {
            text: `$${Intl.NumberFormat('en-US').format(student.totalEgresos)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        text: 'Estado de la vivienda',
        style: 'subheader',
        margin: [0, 8, 0, 8]
      },
      {
        columns: [
          {
            text: `Material`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `${format(student.materialVivienda)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            text: `Condición`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `${format(student.estadoVivienda)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },

    ],
    footer: (currentPage: any, pageCount: any) => {
      return {
        columns: [
          {
            text: '20/12/2023',
            alignment: 'left',
            style: 'small',
            margin: [40, 0, 0, 0],
          },
          {
            text: `${currentPage} de ${pageCount}`,
            alignment: 'right',
            style: 'small',
            margin: [0, 0, 40, 0],
          },
        ]
      };
    },
    header: {
      columns: [
        {
          stack: [
            {
              text: 'Escuela secundaria Estatal 3024',
              margin: [40, 16, 0, 0],
              style: 'small',
            },
            {
              text: 'Clave Federal 08EES0164 R',
              margin: [40, 0, 0, 0],
              style: 'small'
            }
          ],
          alignment: 'left'
        },
        {
          text: 'Ciclo escolar 2022 - 2023',
          margin: [0, 16, 40, 0],
          style: 'small',
          alignment: 'right'
        }
      ]
    },
    styles: {
      title: {
        fontSize: 24,
        bold: true,
        font: 'RobotoBold'
      },
      subtitle: {
        fontSize: 15,
        font: 'RobotoBold'
      },
      header: {
        fontSize: 14,
        bold: true,
        font: 'RobotoBold'
      },
      subheader: {
        fontSize: 13,
        font: 'RobotoBold'
      },
      key: {
        fontSize: 12,
        bold: true
      },
      value: {
        fontSize: 12
      },
      bold: {
        bold: true
      },
      small: {
        fontSize: 10,
        bold: true
      },
      danger: {
        fontSize: 10,
        bold: true,
        color: 'red'
      }
    }
  };

  //@ts-ignore
  pdfMake.createPdf(docDefinition).print();

}

export function printList(students: any[], grado: string, grupo: string) {

  students.sort((a, b) => {
    const textA = a.pApellido.toLowerCase();
    const textB = b.pApellido.toLowerCase();

    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      italics: 'Roboto-Italic.ttf',
      bold: 'Roboto-Medium.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    RobotoBold: {
      normal: 'Roboto-Bold.ttf',
      bold: 'http://localhost:1420/fonts/roboto/Roboto-Black.ttf'
    }
  };

  function generateStudentRows() {
    const rows = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      rows.push([
        { text: `${i + 1}`, style: 'tableItemBold' },
        { text: student.matricula, style: 'tableItemBold' },
        { text: `${student.pApellido} ${student.sApellido} ${student.nombres}`, style: 'tableItem' }
      ]);
    }

    return rows;
  }

  const docDefinition = {
    content: [
      {
        text: 'Lista de alumnos',
        style: 'title'
      },
      {
        text: `Grupo ${grado}°${grupo}`,
        style: 'bold'
      },
      {
        style: 'tableStyle',
        table: {
          headerRows: 1,
          widths: [20, 60, '*'],
          body: [
            [
              { text: 'No.', style: 'tableHeader' },
              { text: 'Matrícula', style: 'tableHeader' },
              { text: 'Nombre', style: 'tableHeader' },
            ],
            [
              { text: '1', style: 'tableItemBold' },
              { text: '00000000', style: 'tableItemBold' },
              { text: 'Paz Valverde Raymundo', style: 'tableItem' }
            ],
            ...generateStudentRows()
          ]
        }
      }
    ],
    header: {
      columns: [
        {
          stack: [
            {
              text: 'Escuela secundaria Estatal 3024',
              margin: [40, 16, 0, 0],
              style: 'small',
            },
            {
              text: 'Clave Federal 08EES0164 R',
              margin: [40, 0, 0, 0],
              style: 'small'
            }
          ],
          alignment: 'left'
        },
        {
          text: 'Ciclo escolar 2022 - 2023',
          margin: [0, 16, 40, 0],
          style: 'small',
          alignment: 'right'
        }
      ]
    },
    footer: (currentPage: any, pageCount: any) => {
      return {
        columns: [
          {
            text: '20/12/2023',
            alignment: 'left',
            style: 'small'
          },
          {
            text: `${currentPage} de ${pageCount}`,
            alignment: 'right',
            style: 'small'
          },
        ]
      };
    },
    styles: {
      tableStyle: {
        margin: [0, 10, 0, 0]
      },
      tableHeader: {
        fontSize: 12,
        bold: true
      },
      tableItem: {
        fontSize: 11
      },
      tableItemBold: {
        fontSize: 11,
        bold: true
      },
      title: {
        fontSize: 24,
        bold: true,
        font: 'RobotoBold'
      },
      bold: {
        bold: true
      },
      small: {
        fontSize: 10,
        bold: true
      }
    }
  };


  //@ts-ignore
  pdfMake.createPdf(docDefinition).print();

}