
export const SERVER_IP = import.meta.env.PROD ? 'https://sibserver.onrender.com' : 'http://localhost:3000';

export function format(type: any): string {
  switch (type) {
    case 'pequena':
      return 'Pequeña';
    case 'numerosa':
      return 'Numerosa';
    case 'mixta':
      return 'Mixta';
    case 'integrada':
      return 'Integrada';
    case 'desintegrada':
      return 'Desintegrada';
    case 'ladrillo':
      return 'Ladrillo';
    case 'adobe':
      return 'Adobe';
    case 'block':
      return 'Block';
    case 'madera':
      return 'Madera';
    case 'propia':
      return 'Propia';
    case 'rentada':
      return 'Rentada';
    case 'prestada':
      return 'Prestada';
    case 'pagandose':
      return 'Pagándose';
  }

  return '';
}


export function formatoEstadoCivil(estadoCivil: string): string {
  switch (estadoCivil) {
    case '0':
      return 'Soltero(a)';
    case '1':
      return 'Casado(a)';
    case '2':
      return 'Unión libre';
  }
  return '';
}

export function formatoEscolaridad(escolaridad: string): string {
  switch (escolaridad) {
    case '0':
      return 'Primaria';
    case '1':
      return 'Secundaria';
    case '2':
      return 'Bachillerato';
    case '3':
      return 'Licenciatura';
    case '4':
      return 'Posgrado';
  }
  return '';
}

export function formatDate(unformattedDate: string): string {
  const splitDate = unformattedDate.split('T')[0].split('-');

  const tempDate = [...splitDate];
  splitDate[0] = tempDate[2];
  splitDate[2] = tempDate[0];

  return splitDate.join('/');
}

export interface MetadataObject {
  version: string;
}

export enum SettingValueType {
  List = "list",
  GenerateList = "gen-list",
  Boolean = "boolean"
}

export interface PossibleValue {
  value: any;
  displayName: string;
}

export interface SettingObject {
  name: string;
  displayName: string;
  description: string;
  value: any;
  type: SettingValueType;
  possibleValues?: PossibleValue[];
}

export interface SettingsCategory {
  name: string;
  displayName: string;
  description: string;
  settings: SettingObject[];
  icon: string;
}

export interface GlobalSettings {
  metadata: MetadataObject;
  categories: SettingsCategory[]
};

export interface Flags {
  [key: string]: number | boolean | string;
};

export function parseBoolean(value: string) {
  value = value.toLowerCase();
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return false;
}

export function formatPerformance(value: string): string {

  switch (value) {
    case '0': {
      return 'Excelente';
    }

    case '1': {
      return 'Bueno';
    }

    case '2': {
      return 'Regular';
    }

    case '3': {
      return 'Malo';
    }

    default: {
      return 'Desconocido';
    }
  }
}
