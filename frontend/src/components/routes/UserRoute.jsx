import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { CurrentUser } from "../../api/authAPI";

const UserRoute = () => {
  //States
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  //Variables
  const { user } = useSelector((state) => state.user);
  const isToastDisplayedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (user && user.token) {
      CurrentUser(user.token)
        .then((res) => {
          setIsUser(true);
        })
        .catch((err) => {
          setIsUser(false);
        });
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!isUser) {
    if (!isToastDisplayedRef.current) {
      toast.error("Please login as user to continue");
      isToastDisplayedRef.current = true;
    }
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default UserRoute;
