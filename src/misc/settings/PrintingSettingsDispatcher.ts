import { SettingsCategory } from "../../util/util";

class PrintingSettingsDispatcher {

  public static CATEGORY_NAME = 'printing';

  public static setupFlags() {
    
    let settingsCategory: SettingsCategory | undefined = undefined;
    for (let i = 0; i < globalThis.settings.categories.length; i++) {
      if (globalThis.settings.categories[i].name === PrintingSettingsDispatcher.CATEGORY_NAME) {
        settingsCategory = globalThis.settings.categories[i];
        break;
      }
    }

    if (settingsCategory) {
      // console.log(settingsCategory);
      for (let i = 0; i < settingsCategory.settings.length; i++) {
        const setting = settingsCategory.settings[i];

        globalThis.flags.set(setting.name, setting.value);
      }
    }
  }
  
  public static changeTonerSaving(setting: boolean) {
    console.log(setting);
    globalThis.flags.set('tonerSaving', setting);
  }
}

export default PrintingSettingsDispatcher;
