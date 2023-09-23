const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");
// Controllers
const { register, login, currentUser } = require("../controllers/auth.controller");

//NOTE: Use isAuth is user is required to be authenticated to perform action (e.g. update address)
// Eg. router.[get|post|put|delete]("/path", isAuth, [controller function])

//NOTE: Use isAdmin if user is required to be authenticated and is admin to perform action (e.g. create new product)
// Eg. router.[get|post|put|delete]("/path", isAuth, isAdmin, [controller function])

// Register user
router.post("/register", register);
// Login user
router.post("/login", login);
// Get current user info
router.post("/current-user", isAuth, isUser, currentUser);
// Get current admin info
router.post("/current-admin", isAuth, isAdmin, currentUser);

module.exports = router;
