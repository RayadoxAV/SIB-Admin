import AppearanceSettingsDispatcher from './AppearanceSettingsDispatcher';
import PrintingSettingsDispatcher from './PrintingSettingsDispatcher';

export function applySetting(setting: { settingName: string, value: any }) {
  // console.log(settingName);
  console.log(setting.settingName, setting.value);
  switch (setting.settingName) {
    case 'appearance.selectedTheme': {
      AppearanceSettingsDispatcher.changeTheme(setting.value as string);
      break;
    }

    case 'printing.tonerSaving': {
      PrintingSettingsDispatcher.changeTonerSaving(setting.value as boolean);
      break;
    }

    default: {
      alert('not implemented');
      break;
    }
  }

  saveSettingsToDisk();
}

function saveSettingsToDisk() {

}
