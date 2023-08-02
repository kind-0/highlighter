#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
use window_ext::WindowExt;
#[cfg(target_os = "macos")]
mod window_ext;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu,Manager, WindowEvent};
fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let close = CustomMenuItem::new("close".to_string(), "Close");
  let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu);
  tauri::Builder::default()
  .setup(|app| {
    #[cfg(target_os = "macos")]
    let main_window = app.get_window("main").unwrap();

    #[cfg(target_os = "macos")]
    main_window.position_traffic_lights(13.0, 17.0); // set inset for traffic lights (macos)

    Ok(())
  })
  .on_window_event(|e| {
    #[cfg(target_os = "macos")]
    let apply_offset = || {
      let win = e.window();
      // keep inset for traffic lights when window resize (macos)
      win.position_traffic_lights(13.0, 17.0);
    };
    #[cfg(target_os = "macos")]
    match e.event() {
      WindowEvent::Resized(..) => apply_offset(),
      WindowEvent::ThemeChanged(..) => apply_offset(),
      _ => {}
    }
  })
  .menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
