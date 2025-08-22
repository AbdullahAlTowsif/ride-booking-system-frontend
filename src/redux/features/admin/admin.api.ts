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
  }),
});

export const {
  useGetAllUsersQuery,
} = adminApi;
