import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPaymentHistoryQuery } from "@/redux/features/payment/payment.api";
import PaymentStatusBadge from "@/components/modules/Payment/PaymentStatusBadge";
import type { IPayment, PaymentStatus } from "@/types/payment.types";

export default function PaymentHistory() {
  const { data, isLoading } = useGetPaymentHistoryQuery(undefined);
  const payments: IPayment[] = data?.data || [];

  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) {
    return <p className="text-center">Loading payment history...</p>;
  }

  const filtered = payments.filter((p) => {
    const date = new Date(p.createdAt);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    const minOk = minAmount ? p.amount >= parseFloat(minAmount) : true;
    const maxOk = maxAmount ? p.amount <= parseFloat(maxAmount) : true;
    const statusOk = status === "all" ? true : p.status === status;
    return afterStart && beforeEnd && minOk && maxOk && statusOk;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <Input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="VALID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INITIATED">Initiated</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Ride ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid At</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-mono text-sm">{p.tranId}</TableCell>
                <TableCell className="font-mono text-sm">{p.ride}</TableCell>
                <TableCell>৳{p.amount}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={p.status as PaymentStatus} />
                </TableCell>
                <TableCell>
                  {p.paidAt
                    ? new Date(p.paidAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  {new Date(p.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No payment history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <p>
          Page {page} of {totalPages || 1}
        </p>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
