const admin = require("../configs/firebaseConfig");
const User = require("../models/user.model");

// Middleware to check for a valid token in the request header
// If valid, it adds the user information to the request object
exports.isAuth = async (req, res, next) => {
  try {
    // Get token from header
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    // Add user to request
    req.user = firebaseUser;
    // Execute next middleware
    next();
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(401).json({ err: "Invalid or expired token" });
  }
};

// Middleware to check if the logged-in user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Get user email from authCheck middleware
    const { email } = req.user;

    // Find user in database
    const adminUser = await User.findOne({ email }).exec();

    // If user is not admin, send error
    if (adminUser.role !== "admin") {
      res.status(403).json({ err: "Admin resource. Access denied." });
    } else {
      // Execute next middleware
      next();
    }
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
