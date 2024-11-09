import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDER_URL}/${order.restaurantId}/order/place-order`,
        method: 'POST',
        body: order,
        credentials: 'include',
      }),
    }),
    getMyOrders: builder.query({
      query: ()=>({
        url:`${ORDER_URL}/orders`,
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    })
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = orderApiSlice;