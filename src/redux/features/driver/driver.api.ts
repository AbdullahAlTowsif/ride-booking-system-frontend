import { baseApi } from "@/redux/baseApi";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    driverAvailability: builder.mutation({
      query: (payload) => ({
        url: "/driver/availability",
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getDriver: builder.query({
      query: () => ({
        url: "/driver/me-driver",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getAvailableRides: builder.query({
      query: () => ({
        url: "/driver/rides-available",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getMyRides: builder.query({
      query: () => ({
        url: "/driver/my-rides",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    acceptRide: builder.mutation({
      query: (id) => ({
        url: `/driver/rides/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),
    rejectRide: builder.mutation({
      query: (id) => ({
        url: `/driver/rides/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateRideStatus: builder.mutation({
      query: (id) => ({
        url: `/driver/rides/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getEarningHistory: builder.query({
      query: () => ({
        url: "/driver/earning-history",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getDriverProfile: builder.query({
      query: () => ({
        url: "/driver/profile",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    updateDriverProfile: builder.mutation({
      query: (payload) => ({
        url: "/driver/update-driver-profile",
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useDriverAvailabilityMutation,
  useGetDriverQuery,
  useAcceptRideMutation,
  useRejectRideMutation,
  useGetAvailableRidesQuery,
  useUpdateRideStatusMutation,
  useGetMyRidesQuery,
  useGetEarningHistoryQuery,
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
} = driverApi;
