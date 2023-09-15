const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
// Controllers
const { allUsers } = require("../controllers/user.controller");

//NOTE: Use isAuth is user is required to be authenticated to perform action (e.g. update address)
// Eg. router.[get|post|put|delete]("/path", isAuth, [controller function])

//NOTE: Use isAdmin if user is required to be authenticated and is admin to perform action (e.g. create new product)
// Eg. router.[get|post|put|delete]("/path", isAuth, isAdmin, [controller function])

// Get All Users
router.get("/all-users", isAuth, isAdmin, allUsers);

module.exports = router;
