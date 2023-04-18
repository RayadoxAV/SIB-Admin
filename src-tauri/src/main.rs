#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;

// fn init() {
//   let data_dir = tauri::api::path::data_dir().unwrap().into_os_string().into_string().unwrap();
//   println!("{:?}", data_dir);

//   if !std::path::Path::new(&(data_dir.clone() + "/sib")).is_dir() {
//     std::fs::create_dir(data_dir + "/sib").expect("Error when creating directory: ");
//     let default_settings = std::fs::read_to_string("./assets/meta/defaultSettings.json").expect("Error: ");
//     std::fs::write(data_dir + "/sib/defaultSettings.json", default_settings)
//   }
// }

fn main() {
  tauri::Builder::default()
    // .setup(|app| {
    //   let resource_path = app.path_resolver()
    //     .resolve_resource("assets/meta/defaultSettings.json")
    //     .expect("Error. Failed to resolve resource");

    //   let file = std::fs::read_to_string(resource_path).expect("Error: ");

    //   println!("{:?}", file);

    //   Ok(())
    // })
    .invoke_handler(tauri::generate_handler![commands::close_splashscreen, commands::load_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
