const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

//Fucntion to register user
exports.register = async (req, res) => {
  try {
    //Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This email already exists.", success: false });
    }

    //Hash password

    //Create new user
    await User.create(req.body);

    // Send response
    res.status(201).json({ message: "User registered successfully.", success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user.", success: false });
  }
};

// Function to login user
exports.login = async (req, res) => {
  try {
    //Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "This email does not exist", success: false });
    }

    //Check if password is correct from db ( to update after hashing password)
    const isPasswordCorrect = req.body.password === user.password;

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect.", success: false });
    }

    //Create Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send response
    res.status(201).json({
      message: "User Login successfully.",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login user.", success: false });
  }
};

// Function to get current user
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.userId }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
