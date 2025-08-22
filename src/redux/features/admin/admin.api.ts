import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // addTour: builder.mutation({
    //   query: (tourData) => ({
    //     url: "/tour/create",
    //     method: "POST",
    //     data: tourData,
    //   }),
    //   invalidatesTags: ["TOUR"],
    // }),
    // removeTourType: builder.mutation({
    //   query: (tourTypeId) => ({
    //     url: `/tour/tour-types/${tourTypeId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["TOUR"],
    // }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["USER"],
    //   transformResponse: (response: IResponse<ITourPackage[]>) => response.data,
    }),
    blockRider: builder.mutation({
      query: (id: string) => ({
        url: `/admin/user/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    unblockRider: builder.mutation({
      query: (id: string) => ({
        url: `/admin/user/unblock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useBlockRiderMutation,
  useUnblockRiderMutation,
} = adminApi;
