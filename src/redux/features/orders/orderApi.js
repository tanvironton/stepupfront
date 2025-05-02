import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // get orders by email address
    getOrdersByEmail: builder.query({
      query: (email) => ({
        url: `/${email}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // get orders by orderId
    getOrdersById: builder.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    // get all orders (admin only)
    getAllOrders: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status, paymentStatus }) => ({
        url: `/update-order-status/${id}`,
        method: "PATCH",
        body: { status, paymentStatus },
      }),
      invalidatesTags: ["Order"],
    }),

    // delete order
    deleteOrderbyId: builder.mutation({
      query: (id) => ({
        url: `/delete-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetOrdersByEmailQuery,
  useGetOrdersByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderbyIdMutation,
} = orderApi;

export default orderApi;
