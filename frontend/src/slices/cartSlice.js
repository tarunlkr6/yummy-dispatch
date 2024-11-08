import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], itemsPrice: 0, taxPrice: 0, serviceCharge: 0, totalPrice: 0, paymentMethod: "PayPal" };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItemIndex = state.cartItems.findIndex(
        (x) => x?.item.id === action.payload.item.id
      );
      console.log('existingItemIndex ',existingItemIndex)
    
      if (existingItemIndex !== -1) { // Check if item exists using !== -1
        state.cartItems[existingItemIndex].qty += 1;
      } else {
        // Add a new item to the cart
        const addNewItem = {
          ...action.payload,
          qty: action.payload.qty > 1 ? action.payload.qty : 1,
        };
        state.cartItems.push(addNewItem);
      }
    
      // Calculate items price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.item.price * item.qty, 0)
      );
    
    
      // Calculate service charge
      state.serviceCharge = addDecimals(state.itemsPrice * 0.1); // 10% service charge
    
      // Calculate tax price (18% tax)
      state.taxPrice = addDecimals(0.18 * state.itemsPrice);
    
      // Calculate total price
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.serviceCharge) +
        Number(state.taxPrice)
      ).toFixed(2);
        
      localStorage.setItem("cart", JSON.stringify(state));
    },
    
    removeFromCart: (state, action) => {
    
      // Filter out the item that matches the ID provided in action.payload
      const updatedCartItems = state.cartItems.filter((item) => item.item.id !== action.payload.id);
      state.cartItems = updatedCartItems;
    
      // Recalculate prices after item removal
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.item.price * item.qty, 0)
      );
      state.serviceCharge = addDecimals(state.itemsPrice * 0.05);
      state.taxPrice = addDecimals(state.itemsPrice * 0.18);
      state.totalPrice = addDecimals(
        Number(state.itemsPrice) +
        Number(state.serviceCharge) +
        Number(state.taxPrice)
      );
    
      // Update local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    
    clearAllCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.serviceCharge = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },
    incrementQty: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (x) => x.item._id === action.payload._id
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].qty += 1;
        this.recalculateTotals(state);
      }
    },
    decrementQty: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (x) => x.item._id === action.payload._id
      );
      if (itemIndex !== -1 && state.cartItems[itemIndex].qty > 1) {
        state.cartItems[itemIndex].qty -= 1;
        this.recalculateTotals(state);
      }
    },
  },
});

export const { addToCart, removeFromCart, clearAllCart, incrementQty, decrementQty } = cartSlice.actions;
export default cartSlice.reducer;
