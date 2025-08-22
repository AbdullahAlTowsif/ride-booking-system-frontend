import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { role } from "@/constants/role";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import FAQ from "@/pages/FAQ";
import Homepage from "@/pages/Landing/Homepage";
import type { TRole } from "@/types/index.types";
import { generateSidebarRoutes } from "@/utils/generateSidebarRoutes";
import { withAuth } from "@/utils/WithAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
        {
            Component: Homepage,
            index: true
        }
    ]
  },
  {
    Component: withAuth(DashboardLayout, role.ADMIN as TRole),
    path: "/admin",
    children: [
      {
        index: true,
        element: <Navigate to="/admin" />,
      },
      ...generateSidebarRoutes(adminSidebarItems),
    ]
  },
  {
    Component: Register,
    path: "/register"
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: FAQ,
    path: "/faq",
  }
]);
