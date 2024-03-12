import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Providers } from "./providers/providers";
import { Toaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Dashboard from "./views/dashboard";
import ServerProperties from "./views/serverProperties";
import Whitelist from "./views/whitelist";
import DataPacks from "./views/dataPacks";
import EC2Stats from "./views/ec2Stats";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/server-properties", element: <ServerProperties /> },
      { path: "/whitelist", element: <Whitelist /> },
      { path: "/data-packs", element: <DataPacks /> },
      { path: "/ec2-stats", element: <EC2Stats /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  </React.StrictMode>
);
