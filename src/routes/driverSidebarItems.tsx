import DriverAvailability from "@/pages/driver/DriverAvailability";
import type { ISidebarItem } from "@/types/index.types";


export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Availability",
        url: "/driver/availabilityStatus",
        component: DriverAvailability
      },
    ],
  },
];
