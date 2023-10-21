const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//Fucntion to register user
exports.register = async (req, res) => {
  try {
    //Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This email already exists.", success: false });
    }

    //Generate a unique salt per user
    const salt = crypto.randomBytes(16).toString("hex");

    //Pre-hash the password if it's longer than the block size
    let preHashedPassword = req.body.password;
    if (preHashedPassword.length > 64) {
      preHashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    }

    //Hash password
    const hashedPassword = crypto.pbkdf2Sync(preHashedPassword, salt, 600000, 64, "sha256").toString("hex");

    //Create new user
    await User.create({
      name: req.body.name,
      email: req.body.email,
      salt: salt,
      password: hashedPassword,
    });

    //Send response
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

    //Pre-hash the provided password if it's longer than the block size
    let preHashedPassword = req.body.password;
    if (preHashedPassword.length > 64) {
      preHashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    }

    //hash the password with the per user salt stored in database
    const hashedPassword = crypto.pbkdf2Sync(preHashedPassword, user.salt, 600000, 64, "sha256").toString("hex");

    //Verify the hashed password with the database password
    if (hashedPassword !== user.password) {
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
