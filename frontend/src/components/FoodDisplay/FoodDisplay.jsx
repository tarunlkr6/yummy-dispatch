// FoodDisplay.jsx
import React from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";


const FoodDisplay = ({ category }) => {

  // Extract the food_list from the API response data
  const food_list = data ? data.data : [];

  if (food_list.length === 0) {
    return <div>No food items available.</div>;
  }

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <>
          <div className="food-display" id="food-display">
            <h2>Top Dishes near you</h2>
            <div className="food-display-list">
              {food_list.map((item, index) => {
                if (category === "All" || category === item.category) {
                  return (
                    <FoodItem
                      key={index}
                      id={item._id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      image={item.image}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FoodDisplay;
