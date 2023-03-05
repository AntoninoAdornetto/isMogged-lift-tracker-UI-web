import React from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "@src/App";
import Home from "@pages/home";
import Login from "@pages/login";
import Register from "@pages/register";
import Dashboard from "@pages/dashboard";
import Exercise from "@pages/exercise";
// import Workout from "@pages/workout";
import Workout from "@pages/_workout";

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
        path: "/stats",
        element: <div>Stats</div>,
      },
      {
        path: "/log",
        element: <div>Logs</div>,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/exercise",
        element: <Exercise />,
      },

      {
        path: "/progress",
        element: <div>Progress</div>,
      },
      {
        path: "/workout",
        element: <Workout />,
      },
    ],
  },
]);
