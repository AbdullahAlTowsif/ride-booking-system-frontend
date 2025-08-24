import AvailableRides from "@/pages/driver/AvailableRides";
import DriverAvailability from "@/pages/driver/DriverAvailability";
import UpdateRideStatus from "@/pages/driver/UpdateRideStatus";
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
      {
        title: "All Available Rides",
        url: "/driver/available-rides",
        component: AvailableRides,
      },
      {
        title: "Update Ride Status",
        url: "/driver/ride-status",
        component: UpdateRideStatus
      },
    ],
  },
];
