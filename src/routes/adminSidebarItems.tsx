import AllRides from "@/pages/Admin/AllRides";
import AllUsers from "@/pages/Admin/AllUsers";
import AnalyticsReport from "@/pages/Admin/AnalyticsReport";
import ApproveSuspendDriver from "@/pages/Admin/ApproveSuspendDriver";
import BlockUnblockRiders from "@/pages/Admin/BlockUnblockRiders";
import UpdateAdminProfile from "@/pages/Admin/UpdateAdminProfile";
import ChangePassword from "@/pages/Auth/ChangePassword";
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
      {
        title: "Approve & Suspend Drivers",
        url: "/admin/approve-suspend-drivers",
        component: ApproveSuspendDriver
      }
    ],
  },
  {
    title: "Ride Oversight",
    items: [
      {
        title: "All Rides",
        url: "/admin/all-rides",
        component: AllRides,
      },
    ],
  },
  {
    title: "Profile Management",
    items: [
      {
        title: "Update Profile",
        url: "/admin/update-profile",
        component: UpdateAdminProfile,
      },
      {
        title: "Change Password",
        url: "/admin/change-password",
        component: ChangePassword,
      },
    ],
  },
];
