import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const sizesApi = createApi({
  reducerPath: "sizesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/sizes`,
    //credentials: "include",
  }),
  tagTypes: ["Sizes"],
  endpoints: (builder) => ({
    fetchAllSizes: builder.query({
      query: () => "",
      providesTags: ["Sizes"],
    }),

    addSize: builder.mutation({
      query: (newSize) => {
        return {
          url: "/create-size",
          method: "POST",
          body: newSize,
          credentials: "include",
        };
      },
      invalidatesTags: ["Sizes"],
    }),

    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/delete-size/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Sizes", id }],
    }),
  }),
});

export const {
  useFetchAllSizesQuery,
  useAddSizeMutation,
  useDeleteSizeMutation,
} = sizesApi;
export default sizesApi;
