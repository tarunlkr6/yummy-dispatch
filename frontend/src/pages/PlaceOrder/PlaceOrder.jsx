import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./PlaceOrder.css";
import { useCreateOrderMutation } from "../../slices/orderApiSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { clearAllCartItems } from "../../slices/cartSlice";
const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [orderData, setOrderData] = useState({
    name: "",
    tableNumber: "",
    items: [],
    totalPrice: 0,
    taxPrice: 0,
    serviceCharge: 0,
    restaurantId: "",
  });

  useEffect(() => {
    setOrderData((prevData) => ({
      ...prevData,
      items: cartItems.map((item) => ({
        name: item.item.name,
        price: item.item.price,
        quantity: item.qty,
        menu: item.item.id,
      })),
      totalPrice: cart.totalPrice,
      taxPrice: cart.taxPrice,
      serviceCharge: cart.serviceCharge,
      restaurantId: cartItems[0]?.resId || "",
    }));
  }, [cartItems, cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createOrder(orderData).unwrap();
      console.log("response", res);
      toast.success(`Order placed successfully!`);
      dispatch(clearAllCartItems());
      navigate('/vieworders')
    } catch (err) {
      console.error("Error placing order: ", err);
      if (err.status === 404) {
        toast.error(
          "The server could not find the requested resource. Please check your connection or try again."
        );
      } else if (err.status === 400) {
        toast.error(
          err.data?.message || "Bad request. Please check the order details."
        );
      } else if (err.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          err.data?.message || "Failed to place order. Please try again."
        );
      }
    }
  };

  return (
    <>
      <div className="">
        <Link to="/cart">
          <Button size="medium" variant="outlined" className="mx-auto">
            Go back
          </Button>
        </Link>
      </div>
      <form onSubmit={submitHandler} className="place-order">
        <div className="place-order-left">
          <p className="title">Order Details</p>
          <table className="order-table">
            <thead>
              <tr>
                <th className="table-header">Item Name</th>
                <th className="table-header">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((food, index) => (
                <tr key={food.item.id || index} className="table-row">
                  <td className="table-data">
                    <strong>{food.item.name}</strong>
                  </td>
                  <td className="table-data">{food.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="multi-fields">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={orderData.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              placeholder="Table No."
              name="tableNumber"
              value={orderData.tableNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-totals-details">
                <p>Subtotal</p>
                <p>&#36;{cart.totalPrice}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                <b>Total</b>
                <b>&#36;{cart.totalPrice}</b>
              </div>
            </div>
            <button
              type="submit"
              className="place-order-button"
              disabled={isLoading}
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
