const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authenticator = require("otplib");

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

    // Function to generate a TOTP secret and QR code URL based on username
    // TODO: Test this function
    function generateTotpSecret(username) {
      const secret = otplib.authenticator.generateSecret();
      const otpauth_url = otplib.authenticator.keyuri(username, 'ThirdLife 2FA', secret);
      return { secret, otpauth_url };
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

    // Generate a TOTP secret and OTPAuth URL for the user
    // TODO: Test this function
    const { secret, otpauth_url } = generateTotpSecret(username);

    //Create new user
    await User.create({
      name: req.body.name,
      email: req.body.email,
      salt: salt,
      password: hashedPassword,
      secret: secret,
    });

    // Generate QR code image from the OTPAuth URL
    // TODO: Test this function
        qrcode.toDataURL(otpauth_url, (err, data_url) => {
          if (err) {
            return res.status(500).json({ message: 'Error generating QR code.', success: false });
          }

        //Send response
        res.status(201).json({ message: "User registered successfully. Scan the QR code with a 2FA app to enable two-factor authentication.", success: true, qrCode: data_url });
        //TODO: Redirect the user to the QR Code page
        });
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

// Function for forgot password
// TODO: Test this whole function
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: "Please provide your email address.", success: false });
    }

    // Check if the email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address.", success: false });
    }

    // Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });

    // If the user exists, handle it
    if (user) {
      // Generate a unique token for password reset
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Set an expiration time for the reset token (e.g., 5 mins from now)
      const resetTokenExpiry = Date.now() + 300000; // 5 mins in milliseconds

      // Store the token and its expiration time in the user's record in the database
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
    }

    // Redirect user to reset password regardless of whether the email exists or not
    //res.status(200).json({ message: 'Successful.', success: true });
    res.redirect(`/reset-password?resetToken=${user.resetToken}`)
  } catch (error) {
    res.status(500).json({ message: "Failed to initiate the password reset process.", success: false });
  }
};

// Function for reset password
// TODO: Test this whole function
exports.resetPassword = async (req, res) => {
  const { otp, newpassword, confirmpassword } = req.body;

  try {
    // Check that the new password is provided
    if (!newpassword) {
      return res.status(400).json({ message: "Please provide a new password.", success: false });
    }

    // Check that the new password meets the strength criteria
    if (!schema.validate(newpassword)) {
      return res.status(400).json({
        message: "Password does not meet the required strength criteria. Password should contains 15-64 characters, at least 1 special character, 1 capital letter and 1 number.",
        success: false
      });
    }

    // Check that the new password and confirm password fields match
    if (newpassword !== confirmpassword) {
      return res.status(400).json({ message: "New password and confirm password fields do not match.", success: false });
    }

    // Check if the OTP is provided
    if (!otp) {
      return res.status(400).json({ message: "Please provide the OTP.", success: false });
    }

    // Check if the OTP is 6 digits long, all numbers
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({ message: "Please provide a valid OTP.", success: false });
    }

    // Check if the password meets the strength criteria
    if (!schema.validate(req.body.password)) {
      return res.status(400).json({
        message: "Password does not meet the required strength criteria. Password should contains 15-64 characters, at least 1 special character, 1 capital letter and 1 number.",
        success: false
        });
      }

    // Retrieve the reset token from the URL and find the user with the matching reset token
    const resetToken = req.query.resetToken;

    // For testing, set the reset token to a placeholder value if it's not provided
    if (!resetToken) {
      resetToken = "iamnotarealtoken"
      //return res.status(400).json({ message: "A valid reset token is required.", success: false });
    }

    const user = await User.findOne({ resetToken: resetToken });

    // Check if the user exists and the reset token is still valid
    if (user && user.resetTokenExpiry > Date.now()) {
      // Retrieve the user's secret from the database
      const secret = user.secret;

      // Generate the expected OTP based on the secret and current timestamp
      const expectedOTP = authenticator.generate(secret);

      // Check if the provided OTP matches the one generated by the server
      if (otp === expectedOTP) {
        // Valid OTP, proceed to reset the password

      // Pre-hash the password if it's longer than the block size
      let preHashedPassword = req.body.newpassword;
      if (preHashedPassword.length > 64) {
        preHashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
      }

      //Hash password
      const hashedPassword = crypto.pbkdf2Sync(preHashedPassword, salt, 600000, 64, "sha256").toString("hex");

      // Update the user's password and reset token fields in the database
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      
      // Send response
      res.status(200).json({ message: "Password reset successful.", success: true });
      } else {
        // If the OTP is invalid, return an error message
        res.status(400).json({ message: "Invalid or expired OTP. Please initiate the password reset process again.", success: false });
      } 
    } else {
      // If the reset token is invalid or expired, return an error message
      res.status(400).json({ message: "Invalid or expired OTP. Please initiate the password reset process again.", success: false });
    }
  } catch {
    res.status(500).json({ message: "Failed to reset the password.", success: false });
  }
};
