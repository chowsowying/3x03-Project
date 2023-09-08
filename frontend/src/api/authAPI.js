// This file is used to make API calls to the backend for authentication

import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/create-or-update-user`;
  const data = {};
  const headers = { authtoken };
  return await axios.post(url, data, { headers });
};

export const currentUser = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/current-user`;
  const data = {};
  const headers = { authtoken };

  return await axios.post(url, data, { headers });
};

export const currentAdmin = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/current-admin`;
  const data = {};
  const headers = { authtoken };

  return await axios.post(url, data, { headers });
};
