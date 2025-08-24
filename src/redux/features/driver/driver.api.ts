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
  }),
});

export const {
  useDriverAvailabilityMutation,
  useGetDriverQuery,
} = driverApi;
