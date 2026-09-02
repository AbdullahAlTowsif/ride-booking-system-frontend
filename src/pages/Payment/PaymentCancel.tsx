import { useSearchParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId") || "";

  if (!rideId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Invalid callback. Missing ride information.
            </p>
            <Link to="/rider/ride-history">
              <Button className="mt-4">Back to Ride History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            You cancelled the payment. No charges were made.
          </p>
          <Separator />
          <div className="flex flex-col gap-2">
            <Link to={`/rider/ride-details/${rideId}`}>
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link to="/rider/ride-history">
              <Button variant="outline" className="w-full">
                Back to Ride History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
