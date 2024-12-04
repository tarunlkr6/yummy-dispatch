import React, { useCallback, useEffect, useState } from "react";
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice";
import { Link, useParams } from "react-router-dom";
import "./RestaurantMenu.css";
import { Button, Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { addToCart } from "../../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);
  const {
    data,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(id);
  const cart = useSelector((state) => state?.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setMenuData(
        data.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.image[0]?.url || "",
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        }))
      );
    }
  }, [data]);

  // Cart management functions
  const addToCartHandler = useCallback((item) => {
    dispatch(addToCart({ item, qty: 1, resId: id })), [dispatch];
  });

  useEffect(() => {
    if (cart.successMessage) {
      toast.success(cart.successMessage);
    } else if (cart.errorMessage) {
      toast.error(cart.errorMessage);
    }
  }, [cart.errorMessage, cart.successMessage]);

  return (
    <>
      <div className="flex items-center justify-center">
        {menuError &&
          toast.error(`Error: ${menuError?.data?.message || menuError.error}`)}
        {menuLoading && (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
          </div>
        )}
      </div>
      <Link to="/">
        <Button size="medium" variant="outlined" className="mx-auto">
          Go back
        </Button>
      </Link>
      <div className="menu-container">
        {menuData.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-details">
              <div className="menu-header">
                <h3>{item.name}</h3>

                <p
                  className={`menu-category ${item.isVeg ? "veg" : "non-veg"}`}
                >
                  {item.isVeg ? (
                    <box-icon name="food-tag" color="#56c309"></box-icon>
                  ) : (
                    <box-icon name="food-tag" color="#d80909"></box-icon>
                  )}
                </p>
              </div>
              <p className="line-clamp-3">{item.description}</p>
              <p className="menu-price">Price: ${item.price}</p>
              <p
                className={`menu-availability ${
                  item.isAvailable ? "available" : "unavailable"
                }`}
              >
                {item.isAvailable ? "Available" : "Not Available"}
              </p>
            </div>
            <div className="menu-footer">
              <button
                onClick={() => addToCartHandler(item)}
                className={`add-to-cart-btn ${
                  !item.isAvailable
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={!item.isAvailable}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RestaurantMenu;
