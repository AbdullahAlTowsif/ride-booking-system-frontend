import { baseApi } from "@/redux/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (rideId: string) => ({
        url: "/payments/initiate",
        method: "POST",
        data: { rideId },
      }),
      invalidatesTags: ["PAYMENT", "RIDES"],
    }),
    getPaymentStatus: builder.query({
      query: (rideId: string) => ({
        url: `/payments/${rideId}/status`,
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
    getPaymentHistory: builder.query({
      query: () => ({
        url: "/payments/me",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useGetPaymentHistoryQuery,
} = paymentApi;
