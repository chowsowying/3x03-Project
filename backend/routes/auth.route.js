const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
// Controllers
const { createOrUpdateUser, currentUser } = require("../controllers/auth.controller");

//NOTE: Use isAuth is user is required to be authenticated to perform action (e.g. update address)
// Eg. router.[get|post|put|delete]("/path", isAuth, [controller function])

//NOTE: Use isAdmin if user is required to be authenticated and is admin to perform action (e.g. create new product)
// Eg. router.[get|post|put|delete]("/path", isAuth, isAdmin, [controller function])

// Create or update user
router.post("/create-or-update-user", isAuth, createOrUpdateUser);
// Get current user info using isAuth middleware
router.post("/current-user", isAuth, currentUser);
// Get current admin info using isAuth and isAdmin middlewares
router.post("/current-admin", isAuth, isAdmin, currentUser);

module.exports = router;
