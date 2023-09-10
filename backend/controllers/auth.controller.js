const User = require("../models/user.model");

// Function to create or update user in database
// The database stores only the user's email and name (no password).
// This data is obtained from firebase auth.
// The database is used to store a list of users and their roles.
exports.createOrUpdateUser = async (req, res) => {
  try {
    //Desctructure data from request user
    const { name, email } = req.user;

    // Find user by email and if found, update
    let user = await User.findOneAndUpdate({ email }, { name: email.split("@")[0] }, { new: true });

    // If not user not found, create new user
    if (!user) {
      user = await new User({ email, name: email.split("@")[0] }).save();
    }
    // Send response
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Function to find user by email and get user info
exports.currentUser = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.user.email }).exec();
    // Send response
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Function to retrieve a list of all users
exports.listAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await User.find({});

    // Send the list of users as a JSON response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};