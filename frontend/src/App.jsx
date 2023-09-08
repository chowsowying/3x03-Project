import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./api/authAPI";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import RegisterComplete from "./pages/RegisterComplete";
// Components
import Header from "./components/Header";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";

function App() {
  // Redux
  const dispatch = useDispatch();

  // Function: Check firebase auth state
  const checkFirebaseAuthState = () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user token from firebase
        const userTokenResult = await user.getIdTokenResult();
        // send token to backend
        currentUser(userTokenResult.token)
          .then((res) => {
            //dispatch to redux store
            dispatch({
              type: "CURRENT_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: userTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    // Cleanup function
    return () => unsubscribe();
  };

  useEffect(() => {
    checkFirebaseAuthState();
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/completeregistration" element={<RegisterComplete />} />
        {/* User Protected Routes */}
        <Route element={<UserRoute />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
