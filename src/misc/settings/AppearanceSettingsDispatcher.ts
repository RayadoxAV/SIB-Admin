class AppearanceSettingsDispatcher {
  public static changeTheme(newTheme: string): void {
    document.getElementById('theme')?.remove();
    const link =
    `<link id="theme" rel="stylesheet" href="/themes/${newTheme}.css">`;
    document.head.insertAdjacentHTML('beforeend', link);
  }  
}

export default AppearanceSettingsDispatcher;
