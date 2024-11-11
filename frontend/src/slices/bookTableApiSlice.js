import { BOOK_TABLE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bookTable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BOOK_TABLE_URL}/${id}/book-table`, 
        method: 'POST',
        body: data,
      }),
    }),
    getTableBookingDetails: builder.query({
      query: (userId) => ({
        url: `${BOOK_TABLE_URL}/details/user/${userId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    cancelBooking: builder.mutation({
      query: ({ resid, bookingid }) => ({
        url: `${BOOK_TABLE_URL}/${resid}/cancel/${bookingid}`,
        method: 'PATCH',
      }),
    }),    
  }),
});

export const { useBookTableMutation, useGetTableBookingDetailsQuery, useCancelBookingMutation } = bookingApiSlice;