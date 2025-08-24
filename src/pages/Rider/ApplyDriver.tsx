/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { useForm, type SubmitHandler } from "react-hook-form";
import { useApplyToBeDriverMutation } from "@/redux/features/rider/rider.api";
import { toast } from "react-hot-toast";

interface ApplyDriverFormValues {
  vehicleType: string;
  vehicleNumber: string;
}

export default function ApplyDriver() {
  const [applyDriver] = useApplyToBeDriverMutation();

  const form = useForm<ApplyDriverFormValues>({
    defaultValues: {
      vehicleType: "",
      vehicleNumber: "",
    },
  });

  const onSubmit: SubmitHandler<ApplyDriverFormValues> = async (data) => {
    try {
      const payload = {
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
      };
      console.log("payload", payload);

      const res = await applyDriver(payload).unwrap();
      // toast.success("Ride request submitted successfully!");
      if (res.success) {
        toast.success("Driver application submitted successfully!");
        form.reset();
      } else {
        toast.error("Something went wrong");
      }
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Driver Application</CardTitle>
          <CardDescription>
            Fill in the details to become a driver
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="vehicleType"
                rules={{ required: "Vehicle Type is Required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter vehicle type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleNumber"
                rules={{ required: "Vehicle Number is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter vehicle number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
