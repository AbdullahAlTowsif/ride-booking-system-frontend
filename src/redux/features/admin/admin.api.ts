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
    getAllDrivers: builder.query({
      query: () => ({
        url: "/admin/drivers",
        method: "GET",
      }),
      providesTags: ["USER"],
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

    approveDriver: builder.mutation({
      query: (id: string) => ({
        url: `/admin/driver/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    suspendDriver: builder.mutation({
      query: (id: string) => ({
        url: `/admin/driver/suspend/${id}`,
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
  useApproveDriverMutation,
  useSuspendDriverMutation,
  useGetAllDriversQuery
} = adminApi;
