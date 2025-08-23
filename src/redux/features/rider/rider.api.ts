import { baseApi } from "@/redux/baseApi";

export const riderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rideRequest: builder.mutation({
      query: (payload) => ({
        url: "/rides/request",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RIDES"],
    }),
    getMyRides: builder.query({
      query: () => ({
        url: "/rides/me",
        method: "GET",
      }),
      providesTags: ["RIDES"],
    }),
  }),
});

export const {
  useRideRequestMutation,
  useGetMyRidesQuery,
} = riderApi;
