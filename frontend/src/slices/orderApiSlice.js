import { apiSlice } from "./apiSlice";
import { ORDER_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDER_URL}/${order.restaurantId}/order/place-order`,
        method: "POST",
        body: order,
        credentials: "include",
      }),
    }),
    addMoreItemOrder: builder.mutation({
      query: ({ orderId, items }) => ({
        url: `${ORDER_URL}/order/${orderId}/add-item`,
        method: "PUT",
        body: { items },
        credentials: "include",
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/orders`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),

    getOrderDetailsById: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/order/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),

    payOrder: builder.mutation({
      query: ({orderId, details}) => ({
        url: `${ORDER_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useAddMoreItemOrderMutation,
  useGetOrderDetailsByIdQuery
} = orderApiSlice;
