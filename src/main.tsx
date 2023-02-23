import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./style.css";
import './assets/styles/font.css';
import './assets/themes/base-theme.css';
import './assets/animations/animations.css';

import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from "./pages/login/Login";
import { AppContextProvider } from "./State";
import Menu from "./pages/menu/Menu";
import Students from "./pages/students/Students";
import TitleBar from "./components/title-bar/TitleBar";
import Student from "./pages/students/Student";
import Users from "./pages/users/Users";
import Settings from "./pages/settings/Settings";
import { GlobalSettings } from "./util/util";
import AddUser from "./pages/users/AddUser";
import Test from "./pages/test/Test";

// emit('settings-loaded', { message: 'holli' });
// for (let i = 0; i < 10000; i++) {
//   console.log('a');
// }

declare global {
  var settings: GlobalSettings
};

document.addEventListener('DOMContentLoaded', async () => {
  // invoke('close_splashscreen');
  // invoke('funcion');
  const unlisten = await listen('loaded-students', (event) => {
    console.log(event);
  });
  // emit('lola', 'ano');
});


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Menu />
      },
      {
        path: '/students',
        element: <Students />,
        errorElement: <div>valio madres</div>
      },
      {
        path: '/student/:id',
        element: <Student />,
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/add-user',
        element: <AddUser />
      },
      {
        path: '/studies',
        element: <Test />
      },
      {
        path: '/settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '/login',
    element:
      <div className='App'>
        <TitleBar title={'SI'} />
        <div className='main-container'>
          <Login />
        </div>
      </div>
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppContextProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AppContextProvider>
);
