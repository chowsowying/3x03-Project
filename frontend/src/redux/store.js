import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";
import { cartSlice } from "./cartSlice";

const store = configureStore({
  reducer: {
    loaders: loaderSlice.reducer,
    user: userSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export default store;
