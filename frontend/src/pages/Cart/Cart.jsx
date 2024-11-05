import React from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../slices/cartSlice"; // Adjust path as needed

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state?.cart);
  const cart = useSelector((state)=> state.cart)
  console.log(cart)

  console.log(cartItems)
  const removeFromCartHandler = (itemId) => {
    dispatch(removeFromCart({ item: { _id: itemId } }));
  };


  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItems.length > 0 ? (
          cartItems.map((food, index) => (
            <div key={index} className="cart-items-title cart-items-item">
              <img src={food.item.image[0]?.url} alt={food.item.name} />
              <p>{food.item.name}</p>
              <p>&#36;{food.item.price}</p>
              <p>{food.qty}</p>
              <p>&#36;{(food.item.price * food.qty).toFixed(2)}</p>
              <p
                onClick={() => removeFromCartHandler(food.item._id)}
                className="cross"
              >
                <i className="fa-solid fa-trash"></i>
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-totals-details">
              <p>Subtotal</p>
              <p>&#36;{cart.itemsPrice}</p>
            </div>
            <hr />
            <div className="cart-totals-details">
              <p>Service Charge</p>
              <p>&#36;{cart.serviceCharge}</p>
            </div>
            <hr/>
            <div className="cart-totals-details">
              <p>Tax</p>
              <p>&#36;{cart.taxPrice}</p>
            </div>

            <hr />
            <div className="cart-totals-details">
              <b>Total</b>
              <b>
                &#36;
                {cart.totalPrice}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        {/* <div className="cart-promocode">
          <div>
            <p>If you have a promocode, Enter here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Cart;
