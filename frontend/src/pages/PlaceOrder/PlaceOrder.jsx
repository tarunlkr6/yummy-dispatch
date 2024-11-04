import React, { useContext } from "react";
import "./PlaceOrder.css";
import "boxicons";
import { useSelector } from "react-redux";

const PlaceOrder = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <>
      <form className="place-order">
        {/* <div className="place-order-left">
      <p className='title'>Delivery Information</p>
      <div className="multi-fields">
        <input type="text" placeholder='First Name'/>
        <input type="text" placeholder='Last Name'/>
      </div>
      <input type="email" placeholder='Email address'/>
      <input type="text" placeholder='Street'/>
      <div className="multi-fields">
        <input type="text" placeholder='City'/>
        <input type="text" placeholder='State'/>
      </div>
      <div className="multi-fields">
        <input type="text" placeholder='Zip Code'/>
        <input type="text" placeholder='Country'/>
      </div>
      <input type="text" placeholder='Phone' />
    </div> */}

        <div className="place-order-left">
          <p className="title">Order Information</p>
          <ul className="mb-5">
            {cartItems.map((food, index) => (
              <li key={food.item.id || index}>
                <strong>{food.item.name}</strong> - {food.qty}
              </li>
            ))}
          </ul>

          <div className="multi-fields">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />

          <input type="number" placeholder="Table no" />
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
            <button>Proceed To Payment</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
