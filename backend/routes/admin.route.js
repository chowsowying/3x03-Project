const express = require("express");
const router = express.Router();

// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");

// Controllers
const { getAllOrders, orderStatus, getEnquiries, deleteEnquiry } = require("../controllers/admin.controller");

// Routes

// Order Routes
// Get all orders for all users (Admin only)
router.get("/user-orders", isAuth, isAdmin, getAllOrders);

router.put("/order-status", isAuth, isAdmin, orderStatus);

// User Enquiries Routes
router.get('/enquiries', isAuth, isAdmin, getEnquiries);
router.delete('/enquiry/:enquiryId', isAuth, isAdmin, deleteEnquiry);


module.exports = router;
