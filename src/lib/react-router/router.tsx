import React from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "@src/App";
import Home from "@pages/home";
import Login from "@pages/login";
import Register from "@pages/register";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error</div>,
    children: [
      {
        path: "/stats/:user_id",
        element: <div>Stats</div>,
      },
      {
        path: "/log/:user_id",
        element: <div>Logs</div>,
      },
      {
        path: "/dashboard/:user_id",
        element: <div>Dashboard</div>,
      },
      {
        path: "/exercise/:user_id",
        element: <div>Exercises</div>,
      },

      {
        path: "/progress/:user_id",
        element: <div>Progress</div>,
      },
    ],
  },
]);
