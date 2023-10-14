const Order = require("../models/order.model");

// exports.getUserOrders = async (req, res) => {
//   try {
//     // Get user ID from the authenticated user
//     const userId = req.user._id;
    
//     // Fetch orders for the user
//     const orders = await Order.find({ orderedBy: userId }).exec();

//     // Send response
//     res.status(200).json(orders);
//   } catch (error) {
//     // Send error response
//     res.status(400).json({ message: error.message, success: false });
//   }
// };

// exports.getAllOrders = async (req, res) => {
//   try {
//     // Fetch all orders (since it's for the admin)
//     const orders = await Order.find({})
//       .populate('orderedBy', 'name email')  // Get user details for each order
//       .populate('products.product', 'title')  // Get product details for each product in the order
//       .exec();

//     // Send response
//     res.status(200).json(orders);
//   } catch (error) {
//     // Send error response
//     res.status(400).json({ message: error.message, success: false });
//   }
// };

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
