import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Timeline } from "@/components/ui/timeline"; // If you don’t have timeline, I’ll simulate it with steps below
import { useGetSingleRideQuery } from "@/redux/features/rider/rider.api";
import { useParams } from "react-router";

export default function RideDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleRideQuery(id);
  console.log(data);

  if (isLoading) return <p className="text-center">Loading...</p>;
  const ride = data?.data;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Ride Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Info */}
          <div>
            <h3 className="text-lg font-semibold">General Information</h3>
            <Separator className="my-2" />
            <div className="space-y-1">
              <p>
                <span className="font-medium">Ride ID:</span> {ride?._id}
              </p>
              <p>
                <span className="font-medium">Pickup:</span>{" "}
                {ride?.pickupLocation.address}
              </p>
              <p>
                <span className="font-medium">Destination:</span>{" "}
                {ride?.destinationLocation.address}
              </p>
              <p>
                <span className="font-medium">Fare:</span> ${ride?.fare}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <Badge>{ride?.status}</Badge>
              </p>
              <p>
                <span className="font-medium">Requested At:</span>{" "}
                {new Date(ride?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Driver Info */}
          <div>
            <h3 className="text-lg font-semibold">Driver Information</h3>
            <Separator className="my-2" />
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{"D"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Driver Id</p>
                {ride.status === "ACCEPTED" ? (
                  <p className="text-sm text-muted-foreground">
                    {ride?.driver}
                  </p>
                ) : (
                  "Not Accepted by any Driver yet"
                )}
              </div>
            </div>
          </div>

          {/* Ride Timeline */}
          <div>
            <h3 className="text-lg font-semibold">Ride Status Timeline</h3>
            <Separator className="my-2" />

            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-green-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                  ✅
                </span>
                <h4 className="font-semibold">Requested</h4>
                <time className="block text-sm text-gray-500">
                  {new Date(ride?.createdAt).toLocaleString()}
                </time>
              </li>
              {ride?.timestamps?.acceptedAt && (
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                    🚖
                  </span>
                  <h4 className="font-semibold">Accepted</h4>
                  <time className="block text-sm text-gray-500">
                    {new Date(ride?.timestamps?.acceptedAt).toLocaleString()}
                  </time>
                </li>
              )}
              {ride?.timestamps?.completedAt && (
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                    🏁
                  </span>
                  <h4 className="font-semibold">Completed</h4>
                  <time className="block text-sm text-gray-500">
                    {new Date(ride?.timestamps?.completedAt).toLocaleString()}
                  </time>
                </li>
              )}
              {ride?.timestamps?.cancelledAt && (
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-red-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                    ❌
                  </span>
                  <h4 className="font-semibold">Cancelled</h4>
                  <time className="block text-sm text-gray-500">
                    {new Date(ride?.timestamps?.cancelledAt).toLocaleString()}
                  </time>
                </li>
              )}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
