/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  useGetDriverRidesQuery,
  useUpdateRideStatusMutation,
} from "@/redux/features/driver/driver.api";

const UpdateRideStatus = () => {
  const { data, isLoading } = useGetDriverRidesQuery(undefined);
  // console.log("Driver Rides Data", data);
  const [updateRideStatus] = useUpdateRideStatusMutation();

  if (isLoading) return <p className="text-center">Loading rides...</p>;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateRideStatus(id).unwrap();
      toast.success(`Ride status updated to ${newStatus}`);
    } catch (error: any) {
      // console.log(error);
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Rides</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ride ID</TableHead>
            <TableHead>Fare</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((ride: any) => {
            const isCompleted = ride.status === "COMPLETED";
            return (
              <TableRow key={ride._id}>
                <TableCell>{ride._id}</TableCell>
                <TableCell>{ride.fare || "N/A"}</TableCell>
                <TableCell>{ride.pickupLocation.address}</TableCell>
                <TableCell>{ride.destinationLocation.address}</TableCell>
                <TableCell>{ride.status}</TableCell>
                <TableCell>
                  <Select
                    disabled={isCompleted}
                    onValueChange={(value) =>
                      handleStatusChange(ride._id, value)
                    }
                  >
                    <SelectTrigger
                      className={`w-[140px] ${
                        isCompleted
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          isCompleted ? "Completed" : "Update Status"
                        }
                      />
                    </SelectTrigger>
                    {!isCompleted && (
                      <SelectContent>
                        <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    )}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UpdateRideStatus;
