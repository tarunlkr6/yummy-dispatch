import { createSlice } from "@reduxjs/toolkit";

// Helper function to format numbers to 2 decimal places
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Helper function to recalculate total prices
const recalculateTotals = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.item.price * item.qty, 0)
  );
  state.serviceCharge = addDecimals(state.itemsPrice * 0.1); // 10% service charge
  state.taxPrice = addDecimals(0.18 * state.itemsPrice); // 18% tax
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.serviceCharge) +
    Number(state.taxPrice)
  ).toFixed(2);
};

// Initial state setup (from localStorage if available, else default)
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      itemsPrice: 0,
      taxPrice: 0,
      serviceCharge: 0,
      totalPrice: 0,
      paymentMethod: "PayPal",
      restaurantId: '',
      errorMessage: '', // For error/warning messages
      successMessage: '', // For success messages
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { resId: restaurantId, item, qty } = action.payload;

      // Check if the cart already contains items from a different restaurant
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.errorMessage = "You can only add items from one restaurant at a time."; // Set error message
        return;
      }

      // If the cart is empty, set the restaurantId to the current restaurant
      if (!state.restaurantId) {
        state.restaurantId = restaurantId;
      }

      const existingItemIndex = state.cartItems.findIndex(
        (x) => x?.item.id === item.id
      );

      if (existingItemIndex !== -1) {
        // If the item already exists, increment the quantity
        state.cartItems[existingItemIndex].qty += qty > 1 ? qty : 1;
      } else {
        // Otherwise, add the new item to the cart
        const newItem = {
          ...action.payload,
          qty: qty > 1 ? qty : 1,
        };
        state.cartItems.push(newItem);
      }

      // Recalculate totals
      recalculateTotals(state);

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state));

      // Set the success message
      state.successMessage = `Item "${item.name}" added to cart successfully!`;

      // Clear any previous error message
      state.errorMessage = '';
    },

    removeFromCart: (state, action) => {
      // Remove item from cart by its ID
      state.cartItems = state.cartItems.filter(
        (item) => item.item.id !== action.payload.id
      );

      // Recalculate totals
      recalculateTotals(state);

      // Update cart in localStorage
      localStorage.setItem("cart", JSON.stringify(state));

      // Clear any previous error or success message
      state.errorMessage = '';
      state.successMessage = ''; 
    },

    clearAllCart: (state) => {
      // Clear the cart and reset everything
      state.cartItems = [];
      state.itemsPrice = 0;
      state.serviceCharge = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      state.restaurantId = ''; 
      state.errorMessage = '';
      state.successMessage = ''; 
      localStorage.removeItem("cart");
    },

    incrementQty: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (x) => x.item.id === action.payload.id
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].qty += 1;
        recalculateTotals(state);
      }
      localStorage.setItem("cart", JSON.stringify(state));

      // Clear any previous error message
      state.errorMessage = '';
    },

    decrementQty: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (x) => x.item.id === action.payload.id
      );
      if (itemIndex !== -1 && state.cartItems[itemIndex].qty > 1) {
        state.cartItems[itemIndex].qty -= 1;
        recalculateTotals(state);
      }
      localStorage.setItem("cart", JSON.stringify(state));

      // Clear any previous error message
      state.errorMessage = '';
    },

    clearAllCartItems: (state) => {
      state.cartItems = [];
      recalculateTotals(state);
      localStorage.removeItem("cart");
      // Clear any previous error or success message
      state.errorMessage = '';
      state.successMessage = '';
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
      state.successMessage = '';
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  clearAllCart,
  incrementQty,
  decrementQty,
  clearAllCartItems,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;
