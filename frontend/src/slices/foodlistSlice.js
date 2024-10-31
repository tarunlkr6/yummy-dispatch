import { FOODLIST_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const foodlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoodList: builder.query({
      query: () => ({
        url: FOODLIST_URL,
      }),
      keepUnusedDataFor: 5, // Keep the data in cache for 5 seconds
    }),
  }),
});

export const { useGetFoodListQuery } = foodlistApiSlice;
