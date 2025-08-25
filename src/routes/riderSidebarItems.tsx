import { lazy } from "react";

const ChangePassword = lazy(() => import("@/pages/Auth/ChangePassword"));
const ApplyDriver = lazy(() => import("@/pages/Rider/ApplyDriver"));
const RideHistory = lazy(() => import("@/pages/Rider/RideHistory"));
const RideRequestForm = lazy(() => import("@/pages/Rider/RideRequestForm"));
const UpdateRiderProfile = lazy(() => import("@/pages/Rider/UpdateRiderProfile"));
import type { ISidebarItem } from "@/types/index.types";
import SafetySettings from "@/components/safety/SafetySettings";

// import ChangePassword from "@/pages/Auth/ChangePassword";
// import ApplyDriver from "@/pages/Rider/ApplyDriver";
// import RideHistory from "@/pages/Rider/RideHistory";
// import RideRequestForm from "@/pages/Rider/RideRequestForm";
// import UpdateRiderProfile from "@/pages/Rider/UpdateRiderProfile";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Apply To Become Driver",
        url: "/rider/apply-driver",
        component: ApplyDriver,
      },
      {
        title: "Ride Request",
        url: "/rider/ride-request",
        component: RideRequestForm,
      },
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory
      },
    ],
  },
  {
    title: "Profile Management",
    items: [
      {
        title: "Update Profile",
        url: "/rider/update-profile",
        component: UpdateRiderProfile
      },
      {
        title: "Change Password",
        url: "/rider/change-password",
        component: ChangePassword
      }
    ],
  },
  {
    title: "Safety Settings",
    items: [
      {
        title: "Setting",
        url: "/rider/safety-setting",
        component: SafetySettings
      }
    ],
  },
];
