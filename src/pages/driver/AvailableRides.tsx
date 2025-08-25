/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useAcceptRideMutation, useGetAvailableRidesQuery, useRejectRideMutation } from "@/redux/features/driver/driver.api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Status color mapping
const statusColors: Record<string, string> = {
  REQUESTED: "text-blue-600",
  ACCEPTED: "text-green-600",
  PICKED_UP: "text-yellow-600",
  IN_TRANSIT: "text-purple-600",
  COMPLETED: "text-emerald-600",
  CANCELLED: "text-red-600",
  REJECTED: "text-gray-600",
};

const AvailableRides = () => {
  const { data, isLoading, isError } = useGetAvailableRidesQuery(undefined);
  const [acceptRide] = useAcceptRideMutation();
  const [rejectRide] = useRejectRideMutation();
  // console.log("available rides", data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin text-primary">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center font-medium mt-6">
        Failed to load rides
      </div>
    );
  }


  const handleAccept = async (id: string) => {
    // console.log(id);
    try {
      await acceptRide(id).unwrap();
      toast.success("Ride accepted successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept ride");
    }
  };

  const handleReject = async (id:string) => {
    // console.log(id);
    try {
      await rejectRide(id).unwrap();
      toast.success("Ride rejected successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject ride");
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="p-4">
        <CardContent>
          <Table>
            <TableCaption>A list of all Available Rides.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Pickup Location</TableHead>
                <TableHead>Destination Location</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accept ✅</TableHead>
                <TableHead>Reject ❌</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length > 0 ? (
                data?.data?.map((ride: any, index: number) => {
                  const colorClass =
                    statusColors[ride.status as keyof typeof statusColors] ||
                    "text-black";

                  return (
                    <TableRow key={ride._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{ride.pickupLocation.address}</TableCell>
                      <TableCell>{ride.destinationLocation.address}</TableCell>
                      <TableCell className="capitalize">{ride.fare}</TableCell>
                      <TableCell>
                        <span className={`${colorClass} font-medium`}>
                          {ride.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">
                        {/* <Link to={`/driver/incoming-request/${ride._id}`}>
                          ✅
                        </Link> */}
                        <Button
                          className="bg-white w-6 h-6 rounded-full hover:cursor-pointer hover:bg-white"
                          onClick={() => handleAccept(ride._id)}
                        >
                          ✅
                        </Button>
                      </TableCell>
                      <TableCell className="capitalize">
                        {/* <Link to={`/driver/incoming-request/${ride._id}`}>
                          ❌
                        </Link> */}
                        <Button
                          className="bg-white w-6 h-6 rounded-full hover:cursor-pointer hover:bg-white"
                          onClick={() => handleReject(ride._id)}
                        >
                          ❌
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-4"
                  >
                    No rides found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableRides;
