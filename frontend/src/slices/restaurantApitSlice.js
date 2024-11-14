import { RESTAURANT_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const restaurantApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurant: builder.query({
            query: (keyword) => ({
                url: `${RESTAURANT_URL}/all`, // get all restaurant
                params: { keyword },
            }),
            keepUnusedDataFor: 5, // Keep the data in cache for 5 seconds
        }),
        getRestaurantDetails: builder.query({
            query: (restaurantId)=>({
                url: `${RESTAURANT_URL}/${restaurantId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createReview: builder.mutation({
            query: ({restaurantId, data}) => ({
                url: `${RESTAURANT_URL}/${restaurantId}/review/add`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['restaurant'], // Invalidate the cache for restaurant tag when a review is added
        }),
    }),
})

export const { useGetRestaurantQuery, useGetRestaurantDetailsQuery, useCreateReviewMutation } = restaurantApiSlice;