import { useSearchParams, Link } from "react-router";
import { useGetPaymentStatusQuery } from "@/redux/features/payment/payment.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId") || "";
  const tranIdParam = searchParams.get("tranId") || "";

  const { data, isLoading, isError } = useGetPaymentStatusQuery(rideId, {
    skip: !rideId,
  });

  if (!rideId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Invalid payment callback. Missing ride information.
            </p>
            <Link to="/rider/ride-history">
              <Button className="mt-4">Back to Ride History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full space-y-4 p-6">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </Card>
      </div>
    );
  }

  const payment = data?.data;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError || !payment ? (
            <p className="text-center text-muted-foreground">
              Unable to verify payment status. Please check your payment
              history.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono font-medium">
                  {payment.tranId || tranIdParam}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">৳{payment.amount}</span>
              </div>
              {payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At:</span>
                  <span>{new Date(payment.paidAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-2">
            <Link to={`/rider/ride-details/${rideId}`}>
              <Button className="w-full">View Ride Details</Button>
            </Link>
            <Link to="/rider/payment-history">
              <Button variant="outline" className="w-full">
                Payment History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
