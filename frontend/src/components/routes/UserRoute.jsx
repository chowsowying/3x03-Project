import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";

const UserRoute = () => {
  // States
  const [loading, setLoading] = useState(true);

  // Declare variables
  const { user } = useSelector((state) => state.user);
  const isToastDisplayedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

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
