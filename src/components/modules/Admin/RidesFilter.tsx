/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllDriversQuery, useGetAllRidesQuery } from "@/redux/features/admin/admin.api";
import { useSearchParams } from "react-router";

export default function RidesFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedRides = searchParams.get("rides") || undefined;
  const selectedDrivers = searchParams.get("driver") || undefined;
  const selectedStatus = searchParams.get("status") || undefined;

  const { data: ridesData, isLoading: ridesIsLoading } = useGetAllRidesQuery(undefined);
  const { data: driverData, isLoading: driverIsLoading } = useGetAllDriversQuery({ limit: 1000, fields: "_id,name" });

  const ridesOption = ridesData?.data?.map((item: { _id: string; rider: string }) => ({
    label: item.rider,
    value: item._id,
  }));

  const driverOptions = driverData?.data?.map((item: { user: any; _id: string }) => ({
    label: item.user.name,
    value: item._id,
  }));

  const handleRideChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("rides", value);
    setSearchParams(params);
  };

  const handleDriverChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("driver", value);
    setSearchParams(params);
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("rides");
    params.delete("driver");
    params.delete("status");
    setSearchParams(params);
  };

  return (
    <div className="col-span-3 w-full border border-muted rounded-md p-5 space-y-4 mb-5">
      <div className="flex justify-between items-center">
        <h1>Filters</h1>
        <Button size="sm" variant="outline" onClick={handleClearFilter}>
          Clear Filter
        </Button>
      </div>

      {/* Rider Filter */}
      <div>
        <Label className="mb-2">Rider</Label>
        <Select onValueChange={handleRideChange} value={selectedRides || ""} disabled={ridesIsLoading}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rider</SelectLabel>
              {ridesOption?.map((item: { value: string; label: string }) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Driver Filter */}
      <div>
        <Label className="mb-2">Driver</Label>
        <Select onValueChange={handleDriverChange} value={selectedDrivers || ""} disabled={driverIsLoading}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Driver</SelectLabel>
              {driverOptions?.map((item: { value: string; label: string }) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <Label className="mb-2">Status</Label>
        <Select onValueChange={handleStatusChange} value={selectedStatus || ""}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {["REQUESTED","ACCEPTED","PICKED_UP","IN_TRANSIT","COMPLETED","CANCELLED","REJECTED"].map(status => (
                <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
