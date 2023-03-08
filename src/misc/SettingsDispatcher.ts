export function applySetting(setting: { settingName: string, value: any }) {
  // console.log(settingName);
  console.log(setting.settingName, setting.value);
  switch (setting.settingName) {
    case 'appearance.selectedTheme': {
      changeTheme(setting.value as string);
      break;
    }

    default: {
      alert('not implemented');
      break;
    }
  }
}

function changeTheme(newTheme: string) {
  document.getElementById('theme')?.remove();
  const link =
  `<link id="theme" rel="stylesheet" href="/themes/${newTheme}.css">`;
  document.head.insertAdjacentHTML('beforeend', link);
}

function saveSettingsToDisk() {

}
