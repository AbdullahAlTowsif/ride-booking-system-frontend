import AllUsers from "@/pages/Admin/AllUsers";
import AnalyticsReport from "@/pages/Admin/AnalyticsReport";
import BlockUnblockRiders from "@/pages/Admin/BlockUnblockRiders";
import RideOversight from "@/pages/Admin/RideOversight";
import type { ISidebarItem } from "@/types/index.types";


export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: AnalyticsReport,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        url: "/admin/all-users",
        component: AllUsers,
      },
      {
        title: "Block & Unblock Riders",
        url: "/admin/block-unblock-riders",
        component: BlockUnblockRiders,
      },
    ],
  },
  {
    title: "Ride Oversight",
    items: [
      {
        title: "All Rides",
        url: "/admin/all-rides",
        component: RideOversight,
      },
    ],
  },
];
