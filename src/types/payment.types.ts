export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "VALID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

export interface IPayment {
  _id: string;
  rider: string;
  ride: string;
  driver: string;
  amount: number;
  currency: "BDT";
  tranId: string;
  valId?: string;
  status: PaymentStatus;
  paidAt?: string;
  ipnReceivedAt?: string;
  verifiedAt?: string;
  raw?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentStatusResponse {
  status: PaymentStatus;
  amount: number;
  tranId: string;
  paidAt?: string;
}

export interface IPaymentInitiateResponse {
  gatewayUrl: string;
  tranId: string;
  paymentId: string;
}
