import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAdminUpdateProfileMutation } from "@/redux/features/admin/admin.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(3, "Name Must be at least 3 characters long"),
  phone: z.string().min(11, "Phone Number must be from BD"),
  address: z.string(),
});

export default function UpdateAdminProfile() {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  //   console.log(userInfo?.data?._id);
//   console.log("admin update user info", userInfo);
  const [updateAdmin] = useAdminUpdateProfileMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.data?.name || "",
      phone: userInfo?.data?.phone || "",
      address: userInfo?.data?.address || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...data,
      };
      const res = await updateAdmin({
        id: userInfo?.data?._id,
        payload,
      }).unwrap();

      if (res.success) {
        toast.success("Admin Profile Updated");
        form.reset();
      } else {
        toast.error("Something went wrong");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.data.message);
      console.error(err);
    }
  };

  if (isLoading) {
    <p>Loading...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Update Your Profile</CardTitle>
          <CardDescription>Profile Management</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-tour-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="add-tour-form">
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
