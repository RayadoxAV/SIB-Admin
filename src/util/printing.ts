import pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfFonts from './misc/vfs_fonts';
import { format, formatDate, formatoEscolaridad, formatoEstadoCivil } from './util';

export function printList(students: any[], grado: string, grupo: string) {

  students.sort((a, b) => {
    const textA = a.pApellido.toLowerCase();
    const textB = b.pApellido.toLowerCase();

    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  pdfMake.vfs = pdfFonts;

  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      italics: 'Roboto-Italic.ttf',
      bold: 'Roboto-Medium.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    RobotoBold: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf'
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
            text: new Date().toLocaleDateString(),
            margin: [40, 0, 0, 0],
            alignment: 'left',
            style: 'small',
          },
          {
            text: `${currentPage} de ${pageCount}`,
            alignment: 'right',
            margin: [0, 0, 40, 0],
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

export function printStudent(student: any, documents: any) {
  pdfMake.vfs = pdfFonts;
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      italics: 'Roboto-Italic.ttf',
      bold: 'Roboto-Medium.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    RobotoBold: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf'
    }
  };

  const docDefinition = {
    content: [
      {
        text: `${student.nombres} ${student.pApellido} ${student.sApellido}`,
        style: 'title'
      },
      {
        text: `Matrícula: ${student.matricula}`,
        style: 'subtitle'
      },
      {
        text: `Grado: ${student.informacion.grado}° - Grupo: ${student.informacion.grupo}`
      },
      {
        text: 'Información personal',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      !globalThis.flags.get('tonerSaving') ? (
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
        }
      ) : (
        null
      ),
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
          }
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
            text: `${student.informacion.direccion}, ${student.informacion.colonia}, ${student.informacion.localidad}`,
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
      !globalThis.flags.get('tonerSaving') ? (
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
        }
      ) : (
        null
      ),
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
        text: 'Información socioeconómica',
        style: 'header',
        margin: [0, 12, 0, 4],
        pageBreak: 'before'
      },
      {
        text: 'Información familiar',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      !globalThis.flags.get('tonerSaving') ? (
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
        }
      ) : (
        null
      ),
      ...generateFamilyInformation(),
      {
        text: 'Información socioeconómica',
        style: 'header',
        margin: [0, 12, 0, 4],
        pageBreak: 'before'
      },
      !globalThis.flags.get('tonerSaving') ? (
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
        }
      ) : (
        null
      ),
      ...generateSocioeconomicInformation(),
      {
        text: 'Información de vivienda',
        style: 'header',
        margin: [0, 12, 0, 4]
      },
      !globalThis.flags.get('tonerSaving') ? (
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
        }
      ) : (
        null
      ),
      {
        columns: [
          {
            text: `Material`,
            alignment: 'left',
            width: '20%',
            style: 'key'
          },
          {
            text: `${format(student.informacion.estudioSoc.materialVivienda)}`,
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
            text: `${format(student.informacion.estudioSoc.estadoVivienda)}`,
            alignment: 'right',
            style: 'value'
          }
        ]
      },
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
    styles: {
      title: {
        fontSize: 24,
        bold: !globalThis.flags.get('tonerSaving'),
        font: !globalThis.flags.get('tonerSaving') ? 'RobotoBold' : 'Roboto'
      },
      header: {
        fontSize: 14,
        bold: !globalThis.flags.get('tonerSaving'),
        font: !globalThis.flags.get('tonerSaving') ? 'RobotoBold' : 'Roboto'
      },
      subheader: {
        fontSize: 13,
        font: !globalThis.flags.get('tonerSaving') ? 'RobotoBold' : 'Roboto'
      },
      key: {
        fontSize: 12,
        bold: !globalThis.flags.get('tonerSaving')
      },
      value: {
        fontSize: 12
      },
      bold: {
        bold: !globalThis.flags.get('tonerSaving'),
      },
      small: {
        fontSize: 10,
        bold: !globalThis.flags.get('tonerSaving'),
      },
      danger: {
        fontSize: 10,
        bold: true,
        color: 'red'
      }
    }
  }

  function generateGrades(documents: any): any[] {
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

  function generateReports(documents: any): any[] {
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
        text: 'Sin reportes registrados'
      });
    }

    return reports;
  }

  function generateFamilyInformation(): any[] {
    const familyInformation = [];
    if (student.informacion.estudioSoc.miembrosFamilia) {
      for (let i = 0; i < student.informacion.estudioSoc.miembrosFamilia.length; i++) {
        const member = student.informacion.estudioSoc.miembrosFamilia[i];
        familyInformation.push(
          {
            columns: [
              {
                text: member.nombreMiembro,
                alignment: 'left',
                width: '70%',
                style: 'key'
              },
              {
                text: member.parentescoMiembro,
                aligment: 'right',
                width: '30%',
                style: 'value'
              }
            ]
          },
          {
            columns: [
              {
                text: `${member.edadMiembro} años`,
                alignment: 'left',
                width: '70%',
                style: 'value'
              },
              {
                text: `${member.ocupacionMiembro}`,
                alignment: 'left',
                width: '30%',
                style: 'value'
              }
            ]
          },
          {
            text: member.emergenciaMiembro ? 'Contacto de emergencia' : '',
            style: 'danger'
          },
          {
            text: '\n'
          }
        );
      }
    } else {
      familyInformation.push(
        {
          text: 'Sin información familiar registrada'
        }
      );
    }

    familyInformation.push(
      {
        text: 'Tipo de familia',
        style: 'subheader',
        margin: [0, 8, 0, 8]
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
            text: `${format(student.informacion.estudioSoc.cantidadMiembros)}`,
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
            text: `${format(student.informacion.estudioSoc.tipoFamilia)}`,
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
            text: `${student.informacion.estudioSoc.miembrosFamilia ? ( student.informacion.estudioSoc.miembrosFamilia.length + 1 ) : 1}`,
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
            text: `${student.informacion.estudioSoc.totalMiembrosTrabajan || 0}`,
            alignment: 'right',
            style: 'value'
          },
        ]
      },
    )

    return familyInformation;
  }

  function generateSocioeconomicInformation(): any[] {
    const socioeconomicInformation = [];
    if (Object.entries(student.informacion.estudioSoc).length > 0) {
      socioeconomicInformation.push(
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.alimentacion)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.medicamentos)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.transporte)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.gasolina)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.educacion)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.abono)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.celulares)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.servicioMedico)}`,
              alignment: 'right',
              style: 'value'
            }
          ]
        },
        {
          columns: [
            {
              text: `Guardería`,
              alignment: 'left',
              width: '20%',
              style: 'key'
            },
            {
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.guarderia)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.agua)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.gasCilindro)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.energiaElectrica)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.telefonoInternet)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.cable)}`,
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
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.otros)}`,
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
              width: '20%',
              style: 'key'
            },
            {
              text: `$${Intl.NumberFormat('en-US').format(student.informacion.estudioSoc.totalEgresos)}`,
              alignment: 'right',
              style: 'value'
            }
          ]
        },
      );
    } else {
      socioeconomicInformation.push(
        {
          text: 'Sin información socioeconómica registrada'
        }
      );
    }
    return socioeconomicInformation;
  }


  //@ts-ignore
  pdfMake.createPdf(docDefinition).print();

}
