use std::net::{ TcpListener, TcpStream };
use std::thread::spawn;
use std::borrow::Cow;
use tungstenite::{ accept, WebSocket };
use tungstenite::protocol::frame::{ CloseFrame, coding::CloseCode };
use tauri::Window;
use serde_json::Value;

#[allow(non_upper_case_globals)]
static mut websockets: Vec<WebSocket<std::net::TcpStream>> = Vec::new();

#[allow(non_upper_case_globals)]
static mut closed: bool = false;

#[allow(non_upper_case_globals)]
static mut win_listener: Option<tauri::EventHandler> = None;

#[tauri::command]
pub fn init_sos_server(window: Window, port: String) -> Result<(), String> {
  match TcpStream::connect(format!("127.0.0.1:{}", port.clone())) {
    Ok(stream) => { drop(stream); return Err("already in use".to_string()) },
    Err(_) => ()
  };

  let lport = port.clone();

  // Create listener
  unsafe {
    match win_listener {
      Some(listener) => window.unlisten(listener),
      None => ()
    }
    win_listener = Some(window.listen("sos-ws", move |event| {
      let payload: Value = serde_json::from_str(event.payload().unwrap()).unwrap();
      let event_type = payload.get("type").unwrap();
      if event_type == "send" {
        let data = payload.get("data").unwrap().to_string();
        let json = data[1..data.len()-1].replace("\\", "");
        for websocket in websockets.iter_mut() {
          if websocket.can_write() {
            let msg = tungstenite::Message::text(json.clone());
            websocket.write_message(msg).unwrap();
          }
        }
      } else if event_type == "close" {
        closed = true;
        for websocket in websockets.iter_mut() {
          websocket.close(Some(CloseFrame { code: CloseCode::Normal, reason: Cow::default() })).unwrap();
        }
        websockets.clear();
        match TcpStream::connect(format!("127.0.0.1:{}", port)) {
          Ok(stream) => { drop(stream) },
          Err(_) => ()
        };
      }
    }));
  }

  // Open WebSocket
  let l = spawn (move || -> Result<(), String> {
    let listener = TcpListener::bind(format!("127.0.0.1:{}", lport)).map_err(|e| e.to_string())?;
    spawn (move || unsafe {
      for stream in listener.incoming() {
        if closed { break };
        match stream {
          Ok(s) => {
            let websocket = accept(s).unwrap();
            websockets.push(websocket);
          },
          Err(e) => { eprintln!("{}", e); continue }
        }
      }
      closed = false;
      drop(listener);
    });
    Ok(())
  });

  l.join().unwrap()?;

  Ok(())
}
