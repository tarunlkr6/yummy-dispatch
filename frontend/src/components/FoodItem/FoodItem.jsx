// FoodItem.jsx
import React from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";

const FoodItem = ({ id, name, price, description, image }) => {
//const url ='https://scan-dine-backend-5qms.onrender.com' 
const url ='http://localhost:8080'

  // Placeholder functions to avoid errors
  const addToCart = (id) => {
    console.log(`Added item ${id} to cart`);
  };

  const removeFromCart = (id) => {
    console.log(`Removed item ${id} from cart`);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={name}
        />
        <div onClick={() => addToCart(id)} className="add">
          <i className="fa-solid fa-plus"></i>
        </div>
        {/* <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to Cart" /> */}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
