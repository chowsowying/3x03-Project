import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

// Load cart items from local storage
if (typeof window !== "undefined") {
  if (localStorage.getItem("cart")) {
    initialState = JSON.parse(localStorage.getItem("cart"));
  } else {
    initialState = [];
  }
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      return action.payload; // Replace the current state with the new cart
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
