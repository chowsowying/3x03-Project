const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");
// Controllers
const {
  allUsers,
  currentUser,
  updateProfile,
  contactAdmin,
  userCart,
  getUserCart,
  emptyUserCart,
  saveAddress,
  getAddress,
  createPaymentIntent,
  createOrder,
  getUserOrders,
  userCount,
  orderCount,
  productCount,
} = require("../controllers/user.controller");

//NOTE: Use isAuth is user is required to be authenticated to perform action (e.g. update address)
// Eg. router.[get|post|put|delete]("/path", isAuth, [controller function])

//NOTE: Use isAdmin if user is required to be authenticated and is admin to perform action (e.g. create new product)
// Eg. router.[get|post|put|delete]("/path", isAuth, isAdmin, [controller function])

// Get All Users
router.get("/all-users", isAuth, isAdmin, allUsers);
// Get User
router.get("/user/profile-page", isAuth, isUser, currentUser);
// Update User
router.put("/user/update-profile", isAuth, isUser, updateProfile);
// Create new form
router.post("/user/contact-admin", isAuth, isUser, contactAdmin);

//Get User Count
router.get("/user/count", isAuth, isAdmin, userCount);
//Get Order Count
router.get("/order/count", isAuth, isAdmin, orderCount);
//Get Product Count
router.get("/product/count", isAuth, isAdmin, productCount);

//------------User Cart------------------------------------------------
// Save User cart
router.post("/user/cart", isAuth, isUser, userCart);
// Get User cart
router.get("/user/cart", isAuth, isUser, getUserCart);
// Empty User cart
router.delete("/user/cart", isAuth, isUser, emptyUserCart);
// Save address
router.post("/user/address", isAuth, isUser, saveAddress);
// Get address
router.get("/user/address", isAuth, isUser, getAddress);

//------------Payment------------------------------------------------
// Stripe
router.post("/create-payment-intent", isAuth, createPaymentIntent);

//------------Orders------------------------------------------------------
// Create Order
router.post("/user/order", isAuth, createOrder);
// View all of user's own orders
router.get("/user/my-orders", isAuth, isUser, getUserOrders);

module.exports = router;
