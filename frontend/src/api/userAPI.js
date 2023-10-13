// This file is used to make API calls to the backend for users

import axios from "axios";

export const GetAllUsers = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/all-users`;
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
