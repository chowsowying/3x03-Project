const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const { listAllUsers } = require("../controllers/auth.controller");
const User = require("../models/user.model");

// Get a list of all users (protected route for admins)
router.get("/all-users", isAuth, isAdmin, listAllUsers, async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find({}).exec();

    // Send the list of users as a JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;