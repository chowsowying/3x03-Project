import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { currentAdmin } from "../../api/authAPI";

const AdminRoute = () => {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Declare variables
  const { user } = useSelector((state) => ({ ...state }));
  const isToastDisplayedRef = useRef(false);

  // Function: Check if logged in user is admin
  const checkIfAdmin = () => {
    setIsLoading(true);
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setIsLoading(false);
          setIsAdmin(true);
        })
        .catch((err) => {
          setIsLoading(false);
          setIsAdmin(false);
        });
    }
  };

  // useEffect
  useEffect(() => {
    checkIfAdmin();
  }, [user]);

  // Handle loading
  if (isLoading) return <Loading />;

  // Handle user not admin
  if (!isAdmin) {
    if (!isToastDisplayedRef.current) {
      toast.error("Please login as admin to continue");
      isToastDisplayedRef.current = true;
    }
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AdminRoute;
