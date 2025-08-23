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
import { useRideRequestMutation } from "@/redux/features/rider/rider.api";
import { toast } from "react-hot-toast";

interface RideRequestFormValues {
  pickupLocation: string;
  destinationLocation: string;
  fare: number;
}

export default function RideRequestForm() {
  const [rideRequest] = useRideRequestMutation();

  const form = useForm<RideRequestFormValues>({
    defaultValues: {
      pickupLocation: "",
      destinationLocation: "",
      fare: 0,
    },
  });

  const onSubmit: SubmitHandler<RideRequestFormValues> = async (data) => {
    try {
      const payload = {
        pickupLocation: {
          address: data.pickupLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        destinationLocation: {
          address: data.destinationLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        fare: Number(data.fare),
      };
      console.log("payload", payload);

      const res = await rideRequest(payload).unwrap();
      // toast.success("Ride request submitted successfully!");
      if (res.success) {
        toast.success("Ride request submitted successfully!");
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
          <CardTitle>Request a Ride</CardTitle>
          <CardDescription>
            Fill in the details to request a new ride
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pickupLocation"
                rules={{ required: "Pickup location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter pickup location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationLocation"
                rules={{ required: "Destination location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter destination location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fare"
                rules={{
                  required: "Fare is required",
                  min: { value: 1, message: "Fare must be > 0" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fare</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter fare"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Ride Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
