const express = require("express");
const router = express.Router();

// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");

// Controllers
const { getAllOrders } = require("../controllers/user-orders.controller");

// Routes

// // Get all orders for a specific user
// router.get("/user/orders", isAuth, isUser, getUserOrders);
// Get all orders for all users (Admin only)
router.get("/user-orders", isAuth, isAdmin, getAllOrders);

// Add more routes related to orders as needed...

module.exports = router;
