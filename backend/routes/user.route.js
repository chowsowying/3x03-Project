const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");
// Controllers
const {
  allUsers,
  userCart,
  getUserCart,
  emptyUserCart,
} = require("../controllers/user.controller");

//NOTE: Use isAuth is user is required to be authenticated to perform action (e.g. update address)
// Eg. router.[get|post|put|delete]("/path", isAuth, [controller function])

//NOTE: Use isAdmin if user is required to be authenticated and is admin to perform action (e.g. create new product)
// Eg. router.[get|post|put|delete]("/path", isAuth, isAdmin, [controller function])

// Get All Users
router.get("/all-users", isAuth, isAdmin, allUsers);

// Save User cart
router.post("/user/cart", isAuth, isUser, userCart);
// Get User cart
router.get("/user/cart", isAuth, isUser, getUserCart);
// Empty User cart
router.delete("/user/cart", isAuth, isUser, emptyUserCart);

module.exports = router;
