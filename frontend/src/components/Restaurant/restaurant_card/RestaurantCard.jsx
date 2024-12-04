// src/components/Restaurant/restaurant_card/RestaurantCard.jsx
import React from "react";
import Card from "./Card";
import { useGetRestaurantQuery } from "../../../slices/restaurantApitSlice";
import { Spinner, Alert } from "@material-tailwind/react";

function RestaurantCard({ keyword }) {
  const { data: Restaurant, isLoading, error } = useGetRestaurantQuery(keyword);

  // Check if Restaurant and Restaurant.data.restaurants exist and are arrays
  const isValidData = Restaurant && Array.isArray(Restaurant.data?.restaurants);

  return (
    <div className="container w-full max-w-none">
      <div className="flex my-5 items-center justify-evenly">
        <div className="flex-auto text-2xl font-bold">Top Restaurant in Odisha</div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
    </div>
        </div>
      ) : error ? (
        <Alert color="red" className="my-4">
          {error?.data?.message || error.error}
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {isValidData ? (
            Restaurant.data.restaurants.map((data, index) => (
              <Card key={index} {...data} />
            ))
          ) : (
            <Alert color="yellow" className="my-4">
              No restaurants available.
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;
