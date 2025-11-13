import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css"; // Your Tailwind CSS + theme file
import App from "./App";
import Home from "./pages/Home";
import Agents from "./pages/Agents";

// Define the application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The App component is the layout for all child routes
    children: [
      {
        index: true, // This makes HomePage the default child route for '/'
        element: <Home />,
      },
      {
        path: "agents",
        Component: Agents,  
      },
      // You can add more pages here later, e.g.:
      // {
      //   path: 'about',
      //   element: <AboutPage />,
      // }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
