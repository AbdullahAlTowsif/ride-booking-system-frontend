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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  useGetSafetyContactsQuery,
  useSaveSafetyContactsMutation,
} from "@/redux/safetyContact/safetyContact.api";

interface SafetySettingsFormValues {
  name: string;
  phone: string;
}

export default function SafetySettings() {
  const { data: contacts = [], isLoading } =
    useGetSafetyContactsQuery(undefined);
  // console.log(contacts.data?.[0].contacts?.[0]);
  const [saveContact] = useSaveSafetyContactsMutation();

  const form = useForm<SafetySettingsFormValues>({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<SafetySettingsFormValues> = async (data) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
      };
      // console.log("payload", payload);

      const res = await saveContact(payload).unwrap();
      // toast.success("Ride request submitted successfully!");
      if (res.success) {
        toast.success("Safety Contact Added successfully!");
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
    <div className="w-full max-w-lg mx-auto mt-16 px-4 space-y-8">
      {/* Existing contacts table */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Safety Contacts</CardTitle>
          <CardDescription>
            List of all your saved emergency contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p>No safety contacts added yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.data?.[0].contacts.map((c: any) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Safety Contact</CardTitle>
          <CardDescription>Fill in the details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Pickup location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Destination location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Contact
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
