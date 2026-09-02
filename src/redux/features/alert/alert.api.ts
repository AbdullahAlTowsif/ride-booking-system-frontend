import { baseApi } from "@/redux/baseApi";


const alertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlert: builder.mutation({
      query: (data) => ({
        url: "/alerts",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ALERT"],
    }),
  }),
});

export const { useCreateAlertMutation } = alertApi;
