// This file is used to make API calls to the backend for users

import axios from "axios";

export const GetAllUsers = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/all-users`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

export const GetSingleUser = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/profile-page`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

export const userCart = async (cart, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/cart`;
  const headers = { authtoken };
  return await axios.post(url, { cart }, { headers });
};

export const getUserCart = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/cart`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

export const emptyUserCart = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/cart`;
  const headers = { authtoken };
  return await axios.delete(url, { headers });
};

export const saveUserAddress = async (address, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/address`;
  const headers = { authtoken };
  return await axios.post(url, { address }, { headers });
};

export const getAddress = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/address`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

export const createPaymentIntent = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/create-payment-intent`;
  const headers = { authtoken };
  return await axios.post(url, {}, { headers });
};

export const createOrder = async (stripeResponse, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/order`;
  const headers = { authtoken };
  return await axios.post(url, { stripeResponse }, { headers });
};

export const GetUserOrders = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user/my-orders`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};