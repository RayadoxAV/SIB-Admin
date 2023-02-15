export const SERVER_IP = 'http://localhost:3000';

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
