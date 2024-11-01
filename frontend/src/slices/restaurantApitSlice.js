import { RESTAURANT_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const restaurantApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurant: builder.query({
            query: () => ({
                url: `${RESTAURANT_URL}/all`, // get all restaurant
            }),
            keepUnusedDataFor: 5, // Keep the data in cache for 5 seconds
        }),
        getRestaurantDetails: builder.query({
            query: (restaurantId)=>({
                url: `${RESTAURANT_URL}/${restaurantId}`,
            }),
            keepUnusedDataFor: 5,
        })
    }),
})

export const { useGetRestaurantQuery, useGetRestaurantDetailsQuery } = restaurantApiSlice;