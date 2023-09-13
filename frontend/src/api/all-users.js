import axios from "axios";

export const listAllUsers = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/all-users`;
  const headers = { authtoken };

  return await axios.get(url, { headers });
};