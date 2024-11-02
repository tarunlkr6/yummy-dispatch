import { MENU_URL } from '../constants';
import { apiSlice } from './apiSlice';


export const menuApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuByRestaurantId: builder.query({
        query: (restaurantId)=>({
            url: `${MENU_URL}/${restaurantId}/menu`,
        }),
        keepUnusedDataFor: 5,
    })
  }),
});

export const { useGetMenuByRestaurantIdQuery } = menuApiSlice;