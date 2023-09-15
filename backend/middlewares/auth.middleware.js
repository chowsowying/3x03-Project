const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Middleware to check for a valid token in the request header
// If valid, it adds the user information to the request object
exports.isAuth = async (req, res, next) => {
  try {
    //Check if token exists
    const token = req.headers.authtoken;

    if (!token) throw new Error("Access Denied");

    //Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};

// Middleware to check if the logged-in user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Get userId from authCheck middleware
    const userId = req.userId;

    // Find user in database
    const adminUser = await User.findById({ _id: userId }).exec();

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
