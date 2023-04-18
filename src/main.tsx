import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./style.css";
import './assets/styles/font.css';
import './assets/animations/animations.css';

import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppContextProvider } from "./State";
import { GlobalSettings } from "./util/util";

import Login from "./pages/login/Login";
import Menu from "./pages/menu/Menu";
import Students from "./pages/students/Students";
import TitleBar from "./components/title-bar/TitleBar";
import Student from "./pages/students/Student";
import Users from "./pages/users/Users";
import Settings from "./pages/settings/Settings";
import AddUser from "./pages/users/AddUser";
import Test from "./pages/test/Test";
import AddInformation from "./pages/students/add-information/AddInformation";
import AddStudent from "./pages/students/add-student/AddStudent";
import Controls from "./pages/controls/Controls";
import NotFound from "./components/NotFound/NotFound";

// Declarar variables globales para las configuraciones iniciales
declare global {
  var settings: GlobalSettings;
  var getSettingValue: Function;
  var setSettingValue: Function;
};

// Crear las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Menu />
      },
      {
        path: '/controls',
        element: <Controls />
      },
      {
        path: '/students',
        element: <Students />,
      },
      {
        path: '/student/:id',
        element: <Student />,
      },
      {
        path: '/add-student',
        element: <AddStudent />
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
        path: '/add-information/:type/:id',
        element: <AddInformation />
      },
      {
        path: '/studies',
        element: <Test />
      },
      {
        path: '/reports',
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
        <div className='main-container'>
          <Login />
        </div>
      </div>
  }
]);

// Inicializar React en modo estricto con el ContextProvider para tener acceso al State global
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppContextProvider>
    {/* TODO: Quitar el StrictMode aunque el build lo quita de manera automática */}
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AppContextProvider>
);
