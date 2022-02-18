#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Menu, MenuItem, Submenu};
mod ws;

#[tauri::command]
fn log(string: String){
  println!("{}", string);
}

fn main() {
  let mut builder = tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      ws::sos::init_sos_server,
      log
    ]);
  if cfg!(target_os = "macos") {
    let menu = Menu::new()
      .add_submenu(Submenu::new(
        "SOS Emulator",
        Menu::new()
          .add_native_item(MenuItem::Hide)
          .add_native_item(MenuItem::HideOthers)
          .add_native_item(MenuItem::ShowAll)
          .add_native_item(MenuItem::Separator)
          .add_native_item(MenuItem::Quit),
      ))
      .add_submenu(Submenu::new(
        "Edit",
        Menu::new()
          .add_native_item(MenuItem::Undo)
          .add_native_item(MenuItem::Redo)
          .add_native_item(MenuItem::Separator)
          .add_native_item(MenuItem::Cut)
          .add_native_item(MenuItem::Copy)
          .add_native_item(MenuItem::Paste)
          .add_native_item(MenuItem::SelectAll),
      ));
      
      builder = builder.menu(menu);
  }
  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
