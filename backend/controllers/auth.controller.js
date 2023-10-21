const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//for implementation of password strength
const passwordValidator = require('password-validator');
const schema = new passwordValidator();

//password strength requirements
schema
  .is().min(15)        // Minimum length 15 characters
  .is().max(64)        // Maximum length 64 characters
  .has().uppercase(1)  // At least 1 uppercase letter
  .has().digits(1)    // At least 1 digit
  .has().symbols(1)   // At least 1 special character (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)


  // function to check for valid names to prevent SQL injection
  function isValidName(name) {
    // Use a regular expression to validate the name format (letters only)
    const nameRegex = /^[A-Za-z\s]+$/; // Allow letters and spaces
    return nameRegex.test(name);
  }


    //function to check for valid email to prevent SQL injection
    function isValidEmail(email) {
      //Regular expression to validate the email format
      const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z.-]+[A-Za-z]{2,4}$/;
      return emailRegex.test(email);
    }

//Fucntion to register user
exports.register = async (req, res) => {
  try {
    const { name, email, password }= req.body;
    // Check if the name is missing
    if (!name) {
      return res.status(400).json({ message: "Please fill up your name.", success: false });
    }
    // Check if the name contains invalid characters
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Please provide a valid name.", success: false });
    }
    // Check if the email is missing
    if (!email) {
      return res.status(400).json({ message: "Please fill in your email.", success: false });
    }
        // Check if the email is invalid
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address.", success: false });
        }

    // Check if the password is missing
    if (!password) {
      return res.status(400).json({ message: "Please fill in your password.", success: false });
    }
    
    //Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This email already exists.", success: false });
    }

    // Check if the password meets the strength criteria
    if (!schema.validate(req.body.password)) {
      return res.status(400).json({
        message: "Password does not meet the required strength criteria. Password should contains 15-64 characters, at least 1 special character, 1 capital letter and 1 number.",
        success: false
        });
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
    const { email, password } = req.body;

    // Check if the email is missing
    if (!email) {
      return res.status(400).json({ message: "Please fill in your email.", success: false });
  }

  // Check if the password is missing
    if (!password) {
      return res.status(400).json({ message: "Please fill in your password.", success: false });
  }  
    
    
    
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
