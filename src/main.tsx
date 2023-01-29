import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./style.css";
import './assets/styles/font.css';
import './assets/themes/base-theme.css';

import { invoke } from "@tauri-apps/api";

setTimeout(() => {
  invoke('close_splashscreen');
}, 1000);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
