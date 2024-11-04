import { OFFER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const offerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getOfferByRestaurantId: builder.query({
          query: (restaurantId)=>({
              url: `${OFFER_URL}/${restaurantId}/offers`,
          }),
          keepUnusedDataFor: 5,
      })
    }),
  });
  
  export const { useGetOfferByRestaurantIdQuery } = offerApiSlice;