import { baseApi } from "@/redux/baseApi";


const alertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlert: builder.mutation({
      query: (data) => ({
        url: "/alerts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ALERT"],
    }),
  }),
});

export const { useCreateAlertMutation } = alertApi;
