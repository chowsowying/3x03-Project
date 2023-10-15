import axios from "axios";

// Fetch all orders for a user
export const GetUserOrders = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user-orders`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

// Add more API calls related to orders as needed...
export const changeStatus = async (orderId, orderStatus, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/order-status`;
  const headers = { authtoken };
  return await axios.put(url, { orderId, orderStatus }, { headers });
};