import { baseApi } from "@/redux/baseApi";

const safetyContact = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSafetyContacts: builder.query({
      query: () => ({
        url: "/safetyContact",
        method: "GET",
      }),
      providesTags: ["SAFETY"],
    }),
    saveSafetyContacts: builder.mutation({
      query: (payload) => ({
        url: "/safetyContact",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["SAFETY"],
    }),
  }),
});

export const { useGetSafetyContactsQuery, useSaveSafetyContactsMutation } = safetyContact;
