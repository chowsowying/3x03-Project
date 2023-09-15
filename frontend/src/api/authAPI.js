// This file is used to make API calls to the backend for authentication
import axios from "axios";

export const RegisterUser = async (name, email, password) => {
  const url = `${import.meta.env.VITE_APP_API}/register`;
  const data = { name, email, password };
  return await axios.post(url, data);
};

export const LoginUser = async (email, password) => {
  const url = `${import.meta.env.VITE_APP_API}/login`;
  const data = { email, password };
  return await axios.post(url, data);
};

export const CurrentUser = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/current-user`;
  const data = {};
  const headers = { authtoken };
  return await axios.post(url, data, { headers });
};

export const CurrentAdmin = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/current-admin`;
  const data = {};
  const headers = { authtoken };
  return await axios.post(url, data, { headers });
};
