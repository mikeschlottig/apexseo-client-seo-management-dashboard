import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/pages/HomePage";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import DashboardPage from "@/pages/DashboardPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import ReportsPage from "@/pages/ReportsPage";
import SalesPipelinePage from "@/pages/SalesPipelinePage";
import SettingsPage from "@/pages/SettingsPage";
import HelpPage from "@/pages/HelpPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "clients",
        element: <ClientsPage />,
      },
      {
        path: "clients/:clientId",
        element: <ClientDetailPage />,
      },
      {
        path: "pipeline",
        element: <SalesPipelinePage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "help",
        element: <HelpPage />,
      },
    ],
  },
]);