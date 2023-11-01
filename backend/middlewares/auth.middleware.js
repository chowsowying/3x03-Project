const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Token Blacklist - this can be in-memory or a database
const tokenBlacklist = new Set();

// Middleware to renew the token on user activity
exports.renewTokenOnActivity = async (req, res, next) => {
  // The user's token is valid, renew it
  const token = jwt.sign({ userId: req.userId }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Renew the token for another 15 minutes
  });
  res.setHeader('authorization', token); // Send the renewed token in the response header
  next();
};

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

// Middleware to check token expiration and blacklist
exports.checkTokenValidity = async (req, res, next) => {
  const token = req.headers.authtoken;
  if (tokenBlacklist.has(token)) {
    const tokenTimestamp = tokenBlacklistTimestamps.get(token);
    if (tokenTimestamp && Date.now() - tokenTimestamp < 15 * 60 * 1000) {
      // Token is blacklisted, but not expired for 15 minutes yet
      return res.status(401).json({ message: 'Token is blacklisted. Please reauthenticate and not do anything SUS.', success: false });
    }
    // Token has expired for 15 minutes, remove it from the blacklist
    tokenBlacklist.delete(token);
    tokenBlacklistTimestamps.delete(token);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.userId) {
      throw new Error('Invalid token');
    }

    // Check if the token will expire in less than 1 minute
    if (decodedToken.exp - Date.now() / 1000 < 60) {
      // Renew the token with a new expiration time
      const renewedToken = jwt.sign({ userId: decodedToken.userId }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Renew the token for another 15 minutes
      });

      // Add the old token to the blacklist
      tokenBlacklist.add(token);
      res.setHeader('authorization', renewedToken); // Send the renewed token in the response header
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token. Please reauthenticate.', success: false });
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

// Middleware to check if the logged-in user is an user
exports.isUser = async (req, res, next) => {
  try {
    // Get userId from authCheck middleware
    const userId = req.userId;

    // Find user in database
    const user = await User.findById({ _id: userId }).exec();

    // If user is not admin, send error
    if (user.role !== "user") {
      res.status(403).json({ err: "User resource. Access denied." });
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

// Add a Map to store the number of failed login attempts per IP
const failedLoginAttempts = new Map();

// Middleware to implement rate limiting
exports.rateLimit = (req, res, next) => {
  const clientIP = req.headers['x-real-ip']; // Assuming you have configured this header
  const maxAttempts = 3; // Maximum allowed login attempts
  const lockoutDuration = 15 * 60 * 1000; // Lockout duration in milliseconds (15 minutes)

  // Check if the IP is in the failedLoginAttempts map
  if (failedLoginAttempts.has(clientIP)) {
    const attempts = failedLoginAttempts.get(clientIP);

    if (attempts >= maxAttempts) {
      // The IP has exceeded the maximum login attempts, lockout the IP
      return res.status(429).json({
        message: `Too many login attempts. Please try again after ${lockoutDuration / 1000} seconds.`,
        success: false,
      });
    } else {
      // Increment the failed attempts count
      failedLoginAttempts.set(clientIP, attempts + 1);
    }
  } else {
    // If the IP is not in the map, add it with 1 failed attempt
    failedLoginAttempts.set(clientIP, 1);
  }

  // After the lockout duration, remove the IP from the map
  setTimeout(() => {
    failedLoginAttempts.delete(clientIP);
  }, lockoutDuration);

  next();
};