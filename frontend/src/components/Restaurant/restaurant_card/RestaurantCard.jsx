import React from "react";
import Card from "./Card";
import { useGetRestaurantQuery } from "../../../slices/restaurantApitSlice";
import { Spinner } from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";
import "./Restaurantcard.css";

function RestaurantCard() {
  const { data: Restaurant, isLoading, error } = useGetRestaurantQuery();
  console.log(Restaurant);

  // const prevSlide = () => {
  //   console.log("prev");
  // };

  // const nextSlide = () => {
  //   console.log("next");
  // };

  return (
    <div className="container mx-auto px-4">
      <div className="flex my-5 items-center justify-between">
        <div className="text-2xl font-bold">Top Restaurant in Odisha</div>
        {/* <div className="flex">
          <div
            className="cursor-pointer flex justify-center items-center w-8 h-8 bg-gray-300 rounded-full mx-2"
            onClick={prevSlide}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div
            className="cursor-pointer flex justify-center items-center w-8 h-8 bg-gray-300 rounded-full mx-2"
            onClick={nextSlide}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner className="h-16 w-16 text-gray-900/50" />
        </div>
      ) : error ? (
        <Alert color="red" className="my-4">
          {error?.data?.message || error.error}
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Restaurant.data.map((data, index) => (
            <Card key={index} {...data} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;
