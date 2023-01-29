#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

// #[tauri::command]
// async fn close_splashscreen(window: tauri::Window) {
//   if let Some(splashscreen) = window.get_window("splashscreen") {
//     splashscreen.close().unwrap();
//   }

//   window.get_window("main").unwrap().show().unwrap();
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
