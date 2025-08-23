// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent } from "@/components/ui/card";
// import { useSearchParams } from "react-router";
// import RidesFilter from "@/components/modules/Admin/RidesFilter";

// // Status color mapping
// const statusColors: Record<string, string> = {
//   REQUESTED: "text-blue-600",
//   ACCEPTED: "text-green-600",
//   PICKED_UP: "text-yellow-600",
//   IN_TRANSIT: "text-purple-600",
//   COMPLETED: "text-emerald-600",
//   CANCELLED: "text-red-600",
//   REJECTED: "text-gray-600",
// };

// const AllRides = () => {
//     const [searchParams] = useSearchParams();
    
//     const rider = searchParams.get("rides") || undefined;
//     const driver = searchParams.get("driver") || undefined;
    
//     const { data } = useGetAllRidesQuery({rider, driver});
//     console.log(data);
//   return (
//     <div className="container mx-auto">
//         <RidesFilter></RidesFilter>
//       <Card className="p-4">
//         <CardContent>
//           {/* Table */}
//           <Table>
//             <TableCaption>A list of all Rides.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[60px]">#</TableHead>
//                 <TableHead>Pickedup Location</TableHead>
//                 <TableHead>Destination Location</TableHead>
//                 <TableHead>Fare</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data?.data?.length > 0 ? (
//                 data?.data?.map((ride: any, index: number) => {
//                   const colorClass =
//                     statusColors[ride.status as keyof typeof statusColors] ||
//                     "text-black";

//                   return (
//                     <TableRow key={ride._id}>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>{ride.pickupLocation.address}</TableCell>
//                       <TableCell>{ride.destinationLocation.address}</TableCell>
//                       <TableCell className="capitalize">{ride.fare}</TableCell>
//                       <TableCell>
//                         <span className={`${colorClass} font-medium`}>
//                           {ride.status}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className="text-center text-gray-500 py-4"
//                   >
//                     No rides found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AllRides;



/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";
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
import { useSearchParams } from "react-router";
import RidesFilter from "@/components/modules/Admin/RidesFilter";

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

const AllRides = () => {
  const [searchParams] = useSearchParams();

  const rider = searchParams.get("rides") || undefined;
  const driver = searchParams.get("driver") || undefined;
  const status = searchParams.get("status") || undefined;

  // Pass only rider, driver, and status to API
  const { data, isLoading, isError } = useGetAllRidesQuery({ rider, driver, status });

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

  return (
    <div className="container mx-auto">
      <RidesFilter />
      <Card className="p-4">
        <CardContent>
          <Table>
            <TableCaption>A list of all Rides.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Pickup Location</TableHead>
                <TableHead>Destination Location</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Status</TableHead>
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

export default AllRides;
