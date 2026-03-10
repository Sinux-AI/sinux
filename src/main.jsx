import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css"; // Your Tailwind CSS + theme file
import App from "./App";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Models from "./pages/Models";
import Workflows from "./pages/Workflows";
import Integrations from "./pages/Integrations";
import WalletPage from "./pages/Wallet";
import Pricing from "./pages/Pricing";
import Knowledge from "./pages/Knowledge";
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
        path: "knowledge",
        Component: Knowledge,
      },
      {
        path: "agents",
        Component: Agents,
      },
      {
        path: "models",
        Component: Models,
      },
      {
        path: "workflows",
        Component: Workflows,
      },
      {
        path: "integrations",
        Component: Integrations,
      },
      {
        path: "wallet",
        Component: WalletPage,
      },
      {
        path: "pricing",
        Component: Pricing,
      },
      {
        path: "chat",



        Component: Chat,
      },
      { path: "auth", Component: Auth },
      { path: "dashboard", Component: Dashboard },
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
  </React.StrictMode>,
);
