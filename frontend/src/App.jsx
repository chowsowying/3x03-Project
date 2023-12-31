import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserMyOrders from "./pages/User/UserMyOrders";
import AllUserOrders from "./pages/Admin/AllUserOrders";
import ViewProduct from "./pages/User/ViewProduct";
import Products from "./pages/Admin/Products";
import Users from "./pages/Admin/Users";
import CreateProduct from "./pages/Admin/CreateProduct";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import UserProfile from "./pages/User/UserProfile";
import UpdateProfile from "./pages/User/UpdateProfile";
import ContactAdmin from "./pages/User/ContactAdmin";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

// Components
import Header from "./components/Header";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import AdminRoute from "./components/routes/AdminRoute";
import UserRoute from "./components/routes/UserRoute";

function App() {
  // Redux
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loaders);

  // Persist user data in redux
  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      dispatch(setUser(user));
    }
  }, [dispatch]);

  return (
    <>
      {loading && <Loading />}
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} /> */}
        {/* User Protected Routes */}
        <Route element={<UserRoute />}>
          <Route path="/user/my-orders" element={<UserMyOrders />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/update-profile" element={<UpdateProfile />} />
          <Route path="/user/view-product/:slug" element={<ViewProduct />} />
          <Route path="/user/contact-admin" element={<ContactAdmin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
        </Route>
        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AllUserOrders />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/create-product" element={<CreateProduct />} />
          <Route path="/admin/update-product/:slug" element={<UpdateProduct />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
