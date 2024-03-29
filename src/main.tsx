import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppContextProvider } from "./State";
import { Flags, GlobalSettings } from "./util/util";

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

import "./style.css";
import './assets/styles/font.css';
import './assets/animations/animations.css';
import PrintingSettingsDispatcher from "./misc/settings/PrintingSettingsDispatcher";
import Reports from "./pages/students/reports/Reports";
import Actions from "./pages/actions/Actions";
import EditStudent from "./pages/students/edit-student/EditStudent";
import EditUser from "./pages/users/edit-user/EditUser";

// Declarar variables globales para las configuraciones iniciales
declare global {
  var settings: GlobalSettings;
  var getSettingValue: Function;
  var setSettingValue: Function;
  var flags: Map<string, number | boolean | string>
};

globalThis.flags = new Map();

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
        path: '/add-information/:type/:id',
        element: <AddInformation />
      },
      {
        path: '/student/reports/:id',
        element: <Reports />
      },
      {
        path: '/add-student',
        element: <AddStudent />
      },
      {
        path: '/edit-student/:id',
        element: <EditStudent />
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
        path: '/edit-user/:id',
        element: <EditUser />
      },
      {
        path: '/actions',
        element: <Actions />
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
