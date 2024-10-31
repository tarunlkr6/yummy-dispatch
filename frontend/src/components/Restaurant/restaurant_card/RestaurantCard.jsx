import React from "react";
import Card from "./Card";
import { useGetRestaurantQuery } from "../../../slices/restaurantSlice";
import { Spinner } from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";


import "./Restaurantcard.css";
function RestaurantCard() {
  const { data: Restaurant, isLoading, error } = useGetRestaurantQuery();
  console.log(Restaurant);

  const prevSlide = () => {
    console.log("next");
  };

  const nextSlide = () => {
    console.log("prev");
  };

  return (
    <>
      <div className="max-w-[1200px} mx-auto">
        <div className="flex my-5 items-center justify-between">
          <div className="text-[25px] font-bold"> Top Restaurant in Odisha</div>
            <div className="flex">
              <div
                className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2"
                onClick={prevSlide}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </div>
              <div
                className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2"
                onClick={nextSlide}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {isLoading ? (
           <Spinner className="h-16 w-16 text-gray-900/50" />
          ) : error ? (
            <Alert color="red">{error?.data?.message || error.error}</Alert>
          ) : (
            Restaurant.data.map((data, index) => (
              <Card key={index} {...data} />
            ))
          )}  
        </div>
      </div>
    </>
  );
}

export default RestaurantCard;
