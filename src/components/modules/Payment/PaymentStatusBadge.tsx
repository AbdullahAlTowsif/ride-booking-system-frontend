import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/payment.types";

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  VALID: {
    label: "Paid",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  INITIATED: {
    label: "Initiated",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

export default function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
