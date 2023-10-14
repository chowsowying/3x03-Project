import axios from "axios";

// Fetch all orders for a user
export const GetUserOrders = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user-orders`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

// Add more API calls related to orders as needed...
