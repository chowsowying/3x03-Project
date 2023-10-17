import axios from "axios";

// Orders Section
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

// Enquiries Section
export const getEnquiries = async (authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/enquiries`;
  const headers = { authtoken };
  return await axios.get(url, { headers });
};
export const deleteEnquiry = async (enquiryId, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/enquiry/${enquiryId}`;
  const headers = { authtoken };
  return await axios.delete(url, { headers });
};
