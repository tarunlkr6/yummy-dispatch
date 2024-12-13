import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage for web
import { combineReducers } from "redux";

// Persist configuration for auth slice
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["userInfo", "accessToken"], // Only persist userInfo and accessToken
};

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  cart: cartSliceReducer,
  auth: persistReducer(persistConfig, authSliceReducer), // Apply persistence to auth slice
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for non-serializable actions in redux-persist
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable devTools in non-production environments
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

export default store;