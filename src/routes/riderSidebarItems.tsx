import RideHistory from "@/pages/Rider/RideHistory";
import RideRequestForm from "@/pages/Rider/RideRequestForm";
import UpdateRiderProfile from "@/pages/Rider/UpdateRiderProfile";
import type { ISidebarItem } from "@/types/index.types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
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
    ],
  },
];
