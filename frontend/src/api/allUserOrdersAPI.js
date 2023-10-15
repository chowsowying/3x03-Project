import axios from "axios";

// Fetch all orders for a user for admin
export const GetAllUserOrders = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/user-orders`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};

// Update status of the order by admin
export const changeStatus = async (orderId, orderStatus, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/order-status`;
  const headers = { authtoken };
  return await axios.put(url, { orderId, orderStatus }, { headers });
};