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
  }),
});

export const {
  useRideRequestMutation
} = riderApi;
