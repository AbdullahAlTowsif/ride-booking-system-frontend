import { lazy } from "react";

const ChangePassword = lazy(() => import("@/pages/Auth/ChangePassword"));
const AvailableRides = lazy(() => import("@/pages/driver/AvailableRides"));
const DriverAvailability = lazy(() => import("@/pages/driver/DriverAvailability"));
const EarningsDashboard = lazy(() => import("@/pages/driver/EarningsDashboard"));
const UpdateDriverProfile = lazy(() => import("@/pages/driver/UpdateDriverProfile"));
const UpdateRideStatus = lazy(() => import("@/pages/driver/UpdateRideStatus"));
import type { ISidebarItem } from "@/types/index.types";

// import ChangePassword from "@/pages/Auth/ChangePassword";
// import AvailableRides from "@/pages/driver/AvailableRides";
// import DriverAvailability from "@/pages/driver/DriverAvailability";
// import EarningsDashboard from "@/pages/driver/EarningsDashboard";
// import UpdateDriverProfile from "@/pages/driver/UpdateDriverProfile";
// import UpdateRideStatus from "@/pages/driver/UpdateRideStatus";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Availability",
        url: "/driver/availabilityStatus",
        component: DriverAvailability,
      },
      {
        title: "All Available Rides",
        url: "/driver/available-rides",
        component: AvailableRides,
      },
      {
        title: "Update Ride Status",
        url: "/driver/ride-status",
        component: UpdateRideStatus,
      },
      {
        title: "Earning History",
        url: "/driver/earnings",
        component: EarningsDashboard,
      },
    ],
  },
  {
    title: "Profile Management",
    items: [
      {
        title: "Update Profile",
        url: "/driver/update-profile",
        component: UpdateDriverProfile,
      },
      {
        title: "Change Password",
        url: "/driver/change-password",
        component: ChangePassword,
      },
    ],
  },
];
