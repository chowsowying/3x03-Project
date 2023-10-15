const Order = require("../models/order.model");

exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders (since it's for the admin)
    const orders = await Order.find({})
      .populate('orderedBy', 'name email')  // Get user details for each order
      .populate('products.product', 'title')  // Get product details for each product in the order
      .exec();

    // Send response
    res.status(200).json(orders);
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

// Add more controller functions related to user orders as needed...
exports.orderStatus = async (req, res) => {
  try {
    // Find order
    const { orderId, orderStatus } = req.body;
    // Update order status
    let updated = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true }).exec();
    // Send updated order as response
    res.status(200).json(updated);
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};