import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const addDecimals = () => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        state.cartItems = state.cartitems.map((x) =>
          x._id === existingItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // calculate items price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        )
      );

      // calculate shipping price (order 100 > free else 10$)
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

      //const service charge

      const serviceCharge = addDecimals(state.itemsPrice / state.cartItems);

      // calculate tax price
      const taxPrice = addDecimals(Number(0.18 * state.itemsPrice));

      // calculate total price
      const totalPrice = (
        Number(state.itemsPrice) +
        Number(state.taxPrice) +
        Number(state.serviceCharge)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));

    },
    removeFromCart: (state, action) => {
        const itemToRemove = action.payload;
      const updatedCartItems = state.cartItems.filter((item) => item._id!== itemToRemove._id);
    }
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions
export default cartSlice.reducer;
