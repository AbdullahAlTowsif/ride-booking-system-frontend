/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  useApproveDriverMutation,
  useSuspendDriverMutation,
  useGetAllDriversQuery,
} from "@/redux/features/admin/admin.api";
import toast from "react-hot-toast";

const ApproveSuspendDriver = () => {
  const {data: driversData, isLoading} = useGetAllDriversQuery(undefined);
//   console.log(driversData?.data[0].user.role);
  const [approveDriver] = useApproveDriverMutation();
  const [suspendDriver] = useSuspendDriverMutation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleAction = async (id: string, approvalStatus: "APPROVED" | "SUSPENDED") => {
    try {
      if (approvalStatus === "APPROVED") {
        await suspendDriver(id).unwrap();
        toast.success("Driver suspended successfully");
      } else {
        await approveDriver(id).unwrap();
        toast.success("Driver approved successfully");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Driver Management</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Approval Status</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {driversData?.data?.length > 0 ? (
            driversData?.data?.map((driver: any, index: number) => (
              <tr key={driver._id}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{driver?.user?.name}</td>
                <td className="border border-gray-300 px-4 py-2">{driver?.user?.email}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{driver.approvalStatus}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Button
                    variant={driver.approvalStatus === "approved" ? "destructive" : "default"}
                    onClick={() => handleAction(driver._id, driver.approvalStatus)}
                  >
                    {driver.approvalStatus === "APPROVED" ? "Suspend" : "Approve"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No drivers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveSuspendDriver;
