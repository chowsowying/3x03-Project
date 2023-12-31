const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otplib = require("otplib");
const authenticator = require("otplib");
const axios = require("axios");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();
const { createLogger, format, transports } = require('winston');

// Helper Function to encrypt plaintext using AES-GCM
function encrypt(plaintext) {
  const TOTP_SYMMETRIC_KEY = Buffer.from(process.env.TOTP_SYMMETRIC_KEY, "hex");
  const TOTP_IV = Buffer.from(process.env.TOTP_IV, "hex");
  // Create an AES-GCM cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", TOTP_SYMMETRIC_KEY, TOTP_IV);
  // Update the cipher with the plaintext
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  // Finalize the encryption and obtain the authentication tag
  ciphertext += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { ciphertext, authTag };
}

// Helper Function to decrypt ciphertext using AES-GCM
function decrypt(ciphertext, authTag) {
  const TOTP_SYMMETRIC_KEY = Buffer.from(process.env.TOTP_SYMMETRIC_KEY, "hex");
  const TOTP_IV = Buffer.from(process.env.TOTP_IV, "hex");
  // Create an AES-GCM decipher
  const decipher = crypto.createDecipheriv('aes-256-gcm', TOTP_SYMMETRIC_KEY, TOTP_IV);
  // Set the authentication tag
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  // Update the decipher with the encrypted data
  let plaintext = decipher.update(ciphertext, 'hex', 'utf-8');
  // Finalize the decryption
  plaintext += decipher.final('utf-8');
  return plaintext;
}

const loginAttemptLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ message }) => {
      return `${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/login_activity.log' }),
  ],
});

const resetPasswordLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ message }) => {
      return `${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/reset_password_activity.log' }),
  ],
});

const registerAccountLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ message }) => {
      return `${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/register_account_activity.log' }),
  ],
});


//for implementation of password strength
const passwordValidator = require("password-validator");
const schema = new passwordValidator();

//password strength requirements
schema
  .is()
  .min(15) // Minimum length 15 characters
  .is()
  .max(64) // Maximum length 64 characters
  .has()
  .uppercase(1) // At least 1 uppercase letter
  .has()
  .digits(1) // At least 1 digit
  .has()
  .symbols(1) // At least 1 special character (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)
  .not()
  .spaces();

// function to check for valid names to prevent SQL injection
function isValidName(name) {
  // Use a regular expression to validate the name format (letters only)
  const nameRegex = /^[A-Za-z\s]{1,64}$/; // Allow letters and spaces till 64 characters
  return nameRegex.test(name);
}

//function to check for valid email to prevent SQL injection
function isValidEmail(email) {
  //Regular expression to validate the email format
  /*
    The local part (before the "@") can have 1 to 63 characters.
    The total length can be up to 254 characters.
    The domain part allows only letters, numbers, hyphens, and periods.
  */
  const emailRegex = /^[A-Za-z0-9._%-]{1,63}@[A-Za-z0-9.-]{1,254}\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

// Function to generate a TOTP secret and QR code URL based on email
function generateTotpSecret(email) {
  const secret = otplib.authenticator.generateSecret();
  const encryptReturn = encrypt(secret);
  const encryptedSecretCiphertext = encryptReturn.ciphertext;
  const encryptedSecretAuthTag = encryptReturn.authTag;
  const otpauth_url = otplib.authenticator.keyuri(email, "ThirdLife 2FA", secret);
  return { encryptedSecretCiphertext, encryptedSecretAuthTag, otpauth_url };
}

// reCAPTCHA Secret Key
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

// Verify reCAPTCHA
const verifyRecaptcha = async (recaptchaResponse) => {
  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
    const response = await axios.post(verificationURL);
    const data = response.data;
    return data.success; // Return whether reCAPTCHA verification succeeded
  } catch (error) {
    return false; // Handle network errors or other issues
  }
};

//Fucntion to register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, recaptchaResponse } = req.body;
    const clientIP = req.headers['x-real-ip'];

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
      return res
        .status(400)
        .json({ message: "Please provide a valid email address.", success: false });
    }

    // Check if the password is missing
    if (!password) {
      return res.status(400).json({ message: "Please fill in your password.", success: false });
    }
    
    // Check if the password meets the strength criteria
    if (!schema.validate(password)) {
      return res.status(400).json({
        message:
          "Password does not meet the required strength criteria. Password should contains 15-64 characters, at least 1 special character, 1 capital letter and 1 number.",
        success: false,
      });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: "reCAPTCHA verification failed.", success: false });
    }

    //Check if user already exists, returning a generic error to prevent email enumeration
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      registerAccountLogger.info(`[${Date.now()}] The following [${clientIP}] has failed to register the account for: [${req.body.email}] as it already exist through [${req.method}] request.`);
      return res.status(400).json({ message: "Failed to register user.", success: false });
    }

    req.body.name = sanitizeHtml(req.body.name);
    req.body.email = sanitizeHtml(req.body.email);
    req.body.password = sanitizeHtml(req.body.password);

    //Generate a unique salt per user
    let uniqueSalt = false;
    let salt;

    while (!uniqueSalt) {
      salt = crypto.randomBytes(16).toString("hex");
      const existingUser = await User.findOne({ salt: salt });

      if (!existingUser) {
        uniqueSalt = true;
      }
    }

    //Pre-hash the password if it's longer than the block size
    let preHashedPassword = req.body.password;
    if (preHashedPassword.length > 64) {
      preHashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    }

    //Hash password
    const hashedPassword = crypto
      .pbkdf2Sync(preHashedPassword, salt, 600000, 64, "sha256")
      .toString("hex");

    // Generate the encrypted TOTP secret, auth tag and OTPAuth URL for the user
    const { encryptedSecretCiphertext, encryptedSecretAuthTag, otpauth_url } = generateTotpSecret(email);

    //Create new user
    await User.create({
      name: req.body.name,
      email: req.body.email,
      salt: salt,
      password: hashedPassword,
      secret: encryptedSecretCiphertext,
      authTag: encryptedSecretAuthTag,
      numberTries: 0,
    });
    registerAccountLogger.info(`[${Date.now()}] The following [${clientIP}] has successfully registered an account for: [${req.body.email}] through [${req.method}] request.`);
    res.status(201).json({ message: "User registered successfully. Scan the QR code with a 2FA app to enable two-factor authentication.", success: true, qrCode: otpauth_url });
  } catch (error) {
    registerAccountLogger.info(`[${Date.now()}] The following [${clientIP}] has failed to register the account for: [${req.body.email}] through [${req.method}] request.`);
    res.status(500).json({ message: "Failed to register user.", success: false });
  }
};

// Function to login user
exports.login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const clientIP = req.headers['x-real-ip'];

    // Check if the email is missing
    if (!email) {
      return res.status(400).json({ message: "Please fill in your email.", success: false });
    }

    // Check if the password is missing
    if (!password) {
      return res.status(400).json({ message: "Please fill in your password.", success: false });
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

    req.body.email = sanitizeHtml(req.body.email);
    req.body.password = sanitizeHtml(req.body.password);

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      loginAttemptLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to login into a non-existing email: [${req.body.email}] but failed through [${req.method}] request.`);
      return res
        .status(400)
        .json({ message: "Please Enter a valid email/password.", success: false });
    }

    // Retrieve the user's secret from the database
    const encryptedSecret = user.secret;
    const authTag = user.authTag;

    // Decrypt the secret using AES-GCM
    const decryptedSecret = decrypt(encryptedSecret, authTag);

    // Compare the provided OTP using otplib again
    const isValid = otplib.authenticator.check(otp, decryptedSecret);

    // Check if the provided OTP matches the one generated by the server
    if (isValid) {
      // Valid OTP, proceed to login
      //Pre-hash the provided password if it's longer than the block size
      let preHashedPassword = req.body.password;
      if (preHashedPassword.length > 64) {
        preHashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
      }


    //hash the password with the per user salt stored in database
    const hashedPassword = crypto
      .pbkdf2Sync(preHashedPassword, user.salt, 600000, 64, "sha256")
      .toString("hex");

    //Verify the hashed password with the database password
    if (hashedPassword !== user.password) {
      user.numberTries += 1;
      await user.save();

      if (user.numberTries >= 3) {
        // If numberTries is 3 or more, prevent further logins
        return res.status(400).json({
          message: "Account has been locked for too many attempts failed.",
          success: false,
        });
      }

      loginAttemptLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to login into an existing email: [${req.body.email}] but failed through [${req.method}] request.`);
      return res
        .status(400)
        .json({ message: "Please Enter a valid email/password.", success: false });
    }

    // Reset numberTries on successful login
    user.numberTries = 0;
    await user.save();

    
    loginAttemptLogger.info(`[${Date.now()}] The following [${clientIP}] has successfully logged into email: [${req.body.email}] through [${req.method}] request.`);

    //Create Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
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
    } else {
        // Increment numberTries when OTP fails
        user.numberTries += 1;
        await user.save();

        if (user.numberTries >= 3) {
          // If numberTries is 3 or more, prevent further logins
          return res.status(400).json({
            message: "Account has been locked for too many attempts failed.",
            success: false,
          });
        }
      loginAttemptLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to login into an existing email: [${req.body.email}] but failed through [${req.method}] request.`);
      // If the OTP is invalid, return a generic error message
      return res.status(400).json({
        message: "Failed to login user.",
        success: false,
      });
    }
  } catch (error) {
    loginAttemptLogger.info(`[${Date.now()}] The following [${clientIP}] has failed login through [${req.method}] request.`);
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
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is provided
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide your email address.", success: false });
    }

    // Check if the email is valid
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address.", success: false });
    }
    //sanitise and remove header
    req.body.email = sanitizeHtml(req.body.email);

    // Generate a unique token for password reset
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set an expiration time for the reset token (e.g., 5 mins from now)
    const resetTokenExpiry = Date.now() + 300000; // 5 mins in milliseconds

    // Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });

    // If the user exists, handle it
    if (user) {
      // Store the token and its expiration time in the user's record in the database
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
    }

    // Redirect user to reset password regardless of whether the email exists or not
    res.status(200).json({ resetToken: resetToken, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to initiate the password reset process.", success: false });
  }
};

// Function for reset password
exports.resetPassword = async (req, res) => {
  const { otp, newPassword, confirmPassword, resetToken } = req.body;
  const clientIP = req.headers['x-real-ip'];

  try {
    // Check that the new password is provided
    if (!newPassword) {
      return res.status(400).json({ message: "Please provide a new password.", success: false });
    }

    // Check that the new password meets the strength criteria
    if (!schema.validate(newPassword)) {
      return res.status(400).json({
        message:
          "Password does not meet the required strength criteria. Password should contains 15-64 characters, at least 1 special character, 1 capital letter and 1 number.",
        success: false,
      });
    }

    // Check that the new password and confirm password fields match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password fields do not match.",
        success: false,
      });
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

    req.body.newpassword = sanitizeHtml(req.body.newpassword);
    req.body.confirmpassword = sanitizeHtml(req.body.confirmpassword);

    const user = await User.findOne({ resetToken: resetToken });

    // Check if the user exists, is not an admin, and the reset token is still valid
    if (user && user.role === "user" && user.resetTokenExpiry > Date.now()) {
      // Retrieve the user's secret and authtag from the database
      const encryptedSecret = user.secret;
      const authTag = user.authTag;

      // Decrypt the secret using AES-GCM
      const decryptedSecret = decrypt(encryptedSecret, authTag);

      // Compare the provided OTP using otplib again
      const isValid = otplib.authenticator.check(otp, decryptedSecret);

      // Check if the provided OTP matches the one generated by the server
      if (isValid) {
        // Valid OTP, proceed to reset the password
        // Pre-hash the password if it's longer than the block size
        let preHashedPassword = newPassword;
        if (preHashedPassword.length > 64) {
          preHashedPassword = crypto.creatfaeHash("sha256").update(newPassword).digest("hex");
        }
        //Generate a unique salt per user
        let uniqueSalt = false;
        let newSalt;

        while (!uniqueSalt) {
          newSalt = crypto.randomBytes(16).toString("hex");
          const existingUser = await User.findOne({ salt: newSalt });

          if (!existingUser) {
            uniqueSalt = true;
          }
        }

        //Hash password
        const hashedPassword = crypto
          .pbkdf2Sync(preHashedPassword, newSalt, 600000, 64, "sha256")
          .toString("hex");

        // Update the user's password and reset token fields in the database
        user.password = hashedPassword;
        user.salt = newSalt;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        resetPasswordLogger.info(`[${Date.now()}] The following [${clientIP}] has successfully reset the password for: [${user.email}] through [${req.method}] request.`);
        // Send response
        res.status(200).json({ message: "Password reset successful.", success: true });
      } else {
        resetPasswordLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to reset password but failed for: [${user.email}] through [${req.method}] request.`);
        // If the OTP is invalid, return a generic error message
        res.status(400).json({
          message: "Failed to reset the password. Please try again.",
          success: false,
        });
      }
    } else {
      resetPasswordLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to reset password but failed for: [${user.email}] through [${req.method}] request.`);
      // If the reset token is invalid or expired, return a generic error message
      res.status(400).json({
        message: "Failed to reset the password. Please try again.",
        success: false,
      });
    }
  } catch {
    resetPasswordLogger.info(`[${Date.now()}] The following [${clientIP}] has attempted to reset password but failed as the email does not exist through [${req.method}] request.`);
    res.status(500).json({ message: "Failed to reset the password. Please try again.", success: false });
  }
};
