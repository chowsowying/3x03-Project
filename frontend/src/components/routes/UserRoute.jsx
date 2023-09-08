import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";

const UserRoute = () => {
  // States
  const [isLoading, setIsLoading] = useState(true);

  // Declare variables
  const { user } = useSelector((state) => ({ ...state }));
  const isToastDisplayedRef = useRef(false);

  // useEffect
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle loading
  if (isLoading) return <Loading />;

  // Handle user not logged in
  if (!user || !user.token) {
    if (!isToastDisplayedRef.current) {
      toast.error("Please login to continue");
      isToastDisplayedRef.current = true;
    }
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default UserRoute;
