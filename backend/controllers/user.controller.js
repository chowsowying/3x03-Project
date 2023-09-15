const User = require("../models/user.model");

// Function to get current user
exports.allUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
