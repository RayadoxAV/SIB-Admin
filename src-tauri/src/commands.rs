use tauri::Manager;

#[tauri::command]
pub fn close_splashscreen(window: tauri::Window) {
  if let Some(splashscreen) = window.get_window("splashscreen") {
    splashscreen.close().unwrap();
  }

  window.get_window("main").unwrap().show().unwrap();
}

// #[derive(Clone, serde::Serialize)]
// pub struct CoreEventPayload {
//     pub message: String,
// }

#[tauri::command]
pub fn load_settings() -> String {
  let default_settings = std::fs::read_to_string("./assets/meta/defaultSettings.json").expect("Error: ");

  return default_settings.into();
}
