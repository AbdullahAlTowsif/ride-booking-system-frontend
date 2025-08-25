import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDriverRidesQuery } from "@/redux/features/driver/driver.api";

interface Ride {
  destinationLocation: { address: string };
  pickupLocation: { address: string };
  _id: string;
  pickup: string;
  destination: string;
  fare: number;
  status:
    | "COMPLETED"
    | "REQUESTED"
    | "ACCEPTED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "CANCELLED"
    | "REJECTED";
  createdAt: string;
}

export default function DriverRideHistory() {
  const { data, isLoading } = useGetDriverRidesQuery(undefined);
//   console.log("Driver Rides", data);
  const rides: Ride[] = data?.data || [];

  // Filters
  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minFare, setMinFare] = useState<string>("");
  const [maxFare, setMaxFare] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p className="text-center">Loading rides...</p>;

  // Filter logic
  const filteredRides = rides.filter((ride) => {
    const rideDate = new Date(ride.createdAt);
    const afterStart = startDate ? rideDate >= new Date(startDate) : true;
    const beforeEnd = endDate ? rideDate <= new Date(endDate) : true;
    const fareMinOk = minFare ? ride.fare >= parseFloat(minFare) : true;
    const fareMaxOk = maxFare ? ride.fare <= parseFloat(maxFare) : true;
    const statusOk = status === "all" ? true : ride.status === status;

    return afterStart && beforeEnd && fareMinOk && fareMaxOk && statusOk;
  });

  // Paginated data
  const paginatedRides = filteredRides.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredRides.length / pageSize);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Ride History</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <Input
          type="number"
          placeholder="Min Fare"
          value={minFare}
          onChange={(e) => setMinFare(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Fare"
          value={maxFare}
          onChange={(e) => setMaxFare(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="REQUESTED">Requested</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="PICKED_UP">Picked Up</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ride ID</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Fare</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRides.length > 0 ? (
            paginatedRides.map((ride) => (
              <TableRow key={ride._id}>
                <TableCell>{ride._id}</TableCell>
                <TableCell>{ride?.pickupLocation.address}</TableCell>
                <TableCell>{ride.destinationLocation.address}</TableCell>
                <TableCell>${ride.fare}</TableCell>
                <TableCell className="capitalize">{ride.status}</TableCell>
                <TableCell>
                  {new Date(ride.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No rides found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <p>
          Page {page} of {totalPages || 1}
        </p>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
