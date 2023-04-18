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
pub fn load_settings(handle: tauri::AppHandle) -> String {

  // Verificar si el directorio de la app ya existe. De no ser el caso lo crea con las default settings, 

  let data_dir = tauri::api::path::data_dir().unwrap().into_os_string().into_string().unwrap();

  if !std::path::Path::new(&(data_dir.clone() + "/sib")).is_dir() {
    println!("Creando archivo settings.json");
    std::fs::create_dir(data_dir.clone() + "/sib").expect("Error when creating directory: ");
    let default_settings_path = handle
    .path_resolver()
    .resolve_resource("assets/meta/defaultSettings.json")
    .expect("Error. Failed to resolve resource");

    let default_settings = std::fs::read_to_string(default_settings_path).expect("Error: ");

    std::fs::write(data_dir + "/sib/settings.json", default_settings.clone()).expect("Error while writing file: ");

    return default_settings.into();
  } else {
    // Verificar que las versiones sean iguales, de lo contrario hacer un reemplazo suave de las settings
    println!("Cargando archivo settings.json");
    let app_dir = tauri::api::path::data_dir().unwrap().into_os_string().into_string().unwrap();

    let settings = std::fs::read_to_string(app_dir + "/sib/settings.json").expect("Error: ");

    return settings.into();
  }
}
