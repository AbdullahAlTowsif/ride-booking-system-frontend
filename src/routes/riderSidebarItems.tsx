import RideRequestForm from "@/pages/Rider/RideRequestForm";
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
    ],
  },
];
