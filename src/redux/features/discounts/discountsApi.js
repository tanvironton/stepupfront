import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const discountsApi = createApi({
    reducerPath: "discountsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api`,
        credentials: "include",
    }),
    tagTypes: ["discounts", "Products", "Categories"],
    endpoints: (builder) => ({
        discountUpdateInProduct: builder.mutation({
            query: ({ id, discount }) => ({
                url: `/products/${id}/discount`, // ✅ Ensure correct API endpoint
                method: "PUT",
                body: { discount },
                credentials: "include",
            }),
            invalidatesTags: ["Products"],
        }),
        discountUpdateInCategory: builder.mutation({
            query: ({ id, discount }) => ({
                url: `/categories/${id}/discount`, // ✅ Ensure correct API endpoint
                method: "PUT",
                body: { discount },
                credentials: "include",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

// ✅ Ensure both hooks are exported
export const {
    useDiscountUpdateInProductMutation, // ✅ Check this is correctly exported
    useDiscountUpdateInCategoryMutation,
} = discountsApi;

export default discountsApi;