import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App";
import { lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Agents = lazy(() => import("./pages/Agents"));
const Chat = lazy(() => import("./pages/Chat"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Models = lazy(() => import("./pages/Models"));
const Workflows = lazy(() => import("./pages/Workflows"));
const Integrations = lazy(() => import("./pages/Integrations"));
const WalletPage = lazy(() => import("./pages/Wallet"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Orchestration = lazy(() => import("./pages/Orchestration"));
const CreateOrg = lazy(() => import("./pages/CreateOrg"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Support = lazy(() => import("./pages/Support"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

import ProtectedRoute from "./authentication/ProtectedRoute";
import AuthSynchronizer from "./authentication/AuthSynchronizer";
import BootstrapSynchronizer from "./components/BootstrapSynchronizer";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

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
      { path: "coming-soon", Component: ComingSoon },
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
      <BootstrapSynchronizer />

      {/* Router stays public-aware */}
      <RouterProvider router={router} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
);