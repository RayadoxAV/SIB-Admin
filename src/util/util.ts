export const SERVER_IP = 'http://localhost:3000';

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

export function parseBoolean(value: string) {
  value = value.toLowerCase();
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return false;
}