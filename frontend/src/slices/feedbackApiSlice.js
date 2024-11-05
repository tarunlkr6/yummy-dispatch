import { RESTAURANT_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const feedbackApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getFeedbackByRestaurantId: builder.query({
        query: (restaurantId) => ({
            url: `${RESTAURANT_URL}/${restaurantId}/reviews`,
        }),
        keepUnusedDataFor: 5,
    })    
    }),
  });
  
  export const { useGetFeedbackByRestaurantIdQuery } = feedbackApiSlice;
