/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
} from "@/redux/features/driver/driver.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(3, "Name Must be at least 3 characters long").optional(),
  phone: z.string().min(11, "Phone Number must be from BD").optional(),
  address: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
});

export default function UpdateDriverProfile() {
  const { data: driverInfo, isLoading } = useGetDriverProfileQuery(undefined);
  //   console.log("driverInfo", driverInfo);
  //   console.log("driverInfo", driverInfo?.data?.vehicleNumber);

  const [updateDriver] = useUpdateDriverProfileMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: driverInfo?.data?.user?.name || "",
      phone: driverInfo?.data?.user?.phone || "",
      address: driverInfo?.data?.user?.address || "",
      vehicleNumber: driverInfo?.data?.vehicleNumber || "",
      vehicleType: driverInfo?.data?.vehicleType || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...data,
      };
      const res = await updateDriver(payload).unwrap();

      if (res.success) {
        toast.success("Driver Profile Updated");
        form.reset();
      } else {
        toast.error("Something went wrong");
      }
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
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Vehicle Type</FormLabel>
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
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Vehicle Number</FormLabel>
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
