/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  useGetAllUsersQuery,
  useBlockRiderMutation,
  useUnblockRiderMutation,
} from "@/redux/features/admin/admin.api";
import toast from "react-hot-toast";

const BlockUnblockRiders = () => {
  const { data: users, isLoading } = useGetAllUsersQuery(undefined);
  const [blockRider] = useBlockRiderMutation();
  const [unblockRider] = useUnblockRiderMutation();

  const handleAction = async (id: string, isBlock: string) => {
    // console.log(id, isBlock);
    try {
      if (isBlock === "UNBLOCK") {
        await blockRider(id).unwrap();
        toast.success("Rider blocked successfully");
      } else {
        await unblockRider(id).unwrap();
        toast.success("Rider unblocked successfully");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rider Management</h2>
      <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b text-left">#</th>
            <th className="p-3 border-b text-left">Name</th>
            <th className="p-3 border-b text-left">Email</th>
            <th className="p-3 border-b text-left">Role</th>
            <th className="p-3 border-b text-left">Status</th>
            <th className="p-3 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.data?.map((user: any, index: number) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{user.name}</td>
              <td className="p-3 border-b">{user.email}</td>
              <td className="p-3 border-b capitalize">{user.role}</td>
              <td className="p-3 border-b capitalize">{user.isBlock}</td>
              <td className="p-3 border-b">
                <Button
                  variant={user.status === "active" ? "destructive" : "default"}
                  onClick={() => handleAction(user._id, user.isBlock)}
                >
                  {user.isBlock === "UNBLOCK" ? "Block" : "Unblock"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockUnblockRiders;
