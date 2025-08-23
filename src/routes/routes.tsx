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
import AboutUs from "@/pages/AboutUs";
import Features from "@/pages/Features";
import Contact from "@/pages/Contact";
import { riderSidebarItems } from "./riderSidebarItems";
import RideDetails from "@/pages/Rider/RideDetails";

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
        element: <Navigate to="/admin/analytics" />,
      },
      ...generateSidebarRoutes(adminSidebarItems),
    ]
  },
  {
    Component: withAuth(DashboardLayout, role.RIDER as TRole),
    path: "/rider",
    children: [
      {
        index: true,
        element: <Navigate to="/rider/ride-history" />,
      },
      ...generateSidebarRoutes(riderSidebarItems),
      {
        Component: RideDetails,
        path: "/rider/ride-details/:id"
      }
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
  },
  {
    Component: AboutUs,
    path: "/about"
  },
  {
    Component: Features,
    path: "/features"
  },
  {
    Component: Contact,
    path: "/contact"
  },
]);
