import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

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
import Orchestration from "./pages/Orchestration";
import CreateOrg from "./pages/CreateOrg";
import AcceptInvite from "./pages/AcceptInvite";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";

import ProtectedRoute from "./authentication/ProtectedRoute";
import AuthSynchronizer from "./authentication/AuthSynchronizer";

/* ---------------- Route Guard Helper ---------------- */

const guarded = (Component) => (
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
);

/* ---------------- Router ---------------- */

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // PUBLIC
      { index: true, element: <Home /> },
      { path: "auth", Component: Auth },
      { path: "pricing", Component: Pricing },
      { path: "accept-invite", Component: AcceptInvite },

      // PROTECTED
      { path: "dashboard", element: guarded(Dashboard) },
      { path: "chat", element: guarded(Chat) },
      { path: "agents", element: guarded(Agents) },
      { path: "workflows", element: guarded(Workflows) },
      { path: "knowledge", element: guarded(Knowledge) },
      { path: "orchestration", element: guarded(Orchestration) },
      { path: "integrations", element: guarded(Integrations) },
      { path: "wallet", element: guarded(WalletPage) },
      { path: "models", element: guarded(Models) },
      { path: "create-org", element: guarded(CreateOrg) },
      { path: "settings", element: guarded(Settings) },
      { path: "support", Component: Support },
      { path: "*", Component: NotFound },
    ],
  },
]);

/* ---------------- Root Bootstrap ---------------- */

function Root() {
  const [isOffline, setIsOffline] = React.useState(false);

  return (
    <>
      {/* Runs once globally */}
      <AuthSynchronizer onOfflineChange={setIsOffline} />

      {/* Router stays public-aware */}
      <RouterProvider router={router} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);