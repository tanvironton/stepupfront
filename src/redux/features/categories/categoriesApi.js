import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/categories`,
    //credentials: "include",
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    fetchAllCategories: builder.query({
      query: () => "",
      providesTags: ["Categories"],
    }),

    addCategory: builder.mutation({
      query: (newCategory) => {
        return {
          url: "/create-category",
          method: "POST",
          body: newCategory,
          credentials: "include",
        };
      },
      invalidatesTags: ["Products"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Categories", id }],
    }),
  }),
});

export const {
  useFetchAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
export default categoriesApi;
