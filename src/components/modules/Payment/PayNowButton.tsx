import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useInitiatePaymentMutation } from "@/redux/features/payment/payment.api";
import { toast } from "react-hot-toast";

interface PayNowButtonProps {
  rideId: string;
  isPaid: boolean;
  rideStatus: string;
}

export default function PayNowButton({
  rideId,
  isPaid,
  rideStatus,
}: PayNowButtonProps) {
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();

  const isDisabled = rideStatus !== "COMPLETED" || isPaid || isLoading;

  const handlePay = async () => {
    try {
      const res = await initiatePayment(rideId).unwrap();
      window.location.href = res.data.gatewayUrl;
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to initiate payment");
    }
  };

  return (
    <Button onClick={handlePay} disabled={isDisabled} className="w-full">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Initiating Payment..." : "Pay Now"}
    </Button>
  );
}
