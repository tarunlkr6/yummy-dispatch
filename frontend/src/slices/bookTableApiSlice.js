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
  }),
});

export const { useBookTableMutation } = bookingApiSlice;