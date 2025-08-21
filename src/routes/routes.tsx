import App from "@/App";
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
]);
