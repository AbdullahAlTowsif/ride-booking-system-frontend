import App from "@/App";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import FAQ from "@/pages/FAQ";
import Homepage from "@/pages/Landing/Homepage";
import { createBrowserRouter } from "react-router";

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
