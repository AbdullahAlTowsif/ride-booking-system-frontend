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
    getSingleRide: builder.query({
      query: (id) => ({
        url: `/rides/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDES"],
    }),
    riderUpdateProfile: builder.mutation({
      query: ({id, payload}) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useRideRequestMutation,
  useGetMyRidesQuery,
  useGetSingleRideQuery,
  useRiderUpdateProfileMutation,
} = riderApi;
