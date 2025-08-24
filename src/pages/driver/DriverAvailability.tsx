import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useDriverAvailabilityMutation, useGetDriverQuery } from "@/redux/features/driver/driver.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function DriverAvailability() {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: driverData } = useGetDriverQuery(undefined);
//   console.log(driverData);
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("OFFLINE");
  const [updateDriver, { isLoading }] = useDriverAvailabilityMutation();

  const driverId = userData?.data?._id || "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initialStatus = driverData?.data?.availabilityStatus || "OFFLINE";

  // Sync status from server when driverData changes
  useEffect(() => {
    if (driverData?.data?.availabilityStatus) {
      setStatus(driverData.data.availabilityStatus);
    }
  }, [driverData]);

  const handleToggle = async (checked: boolean) => {
    const newStatus = checked ? "ONLINE" : "OFFLINE";
    const previousStatus = status;

    setStatus(newStatus);

    try {
      const payload = {
        availabilityStatus: newStatus,
      };
    //   console.log("payload", payload);

      const res = await updateDriver(payload).unwrap();
      console.log("res", res);
      toast.success(`You are now ${newStatus}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error.data.message);
      setStatus(previousStatus);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
      <Label htmlFor="driver-status" className="text-lg font-medium">
        Availability
      </Label>
      <Switch
        id="driver-status"
        checked={status === "ONLINE"}
        onCheckedChange={handleToggle}
        disabled={isLoading || !driverId}
      />
      <span
        className={`font-semibold transition-colors ${
          status === "ONLINE" ? "text-green-600" : "text-red-600"
        }`}
      >
        {isLoading ? "Updating..." : status}
      </span>
    </div>
  );
}
