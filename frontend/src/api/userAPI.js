// This file is used to make API calls to the backend for users

import axios from "axios";

export const GetAllUsers = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/all-users`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};
