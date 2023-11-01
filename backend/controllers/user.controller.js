const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");
const Form = require("../models/form.model");
const crypto = require("crypto");
const sanitizeHtml = require("sanitize-html");



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
  .symbols(1)
  .not()
  .spaces(); // At least 1 special character (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)

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

function isValidTitle(title) {
  const titleRegex = /^[A-Za-z\s0-9]+$/;
  return titleRegex.test(title);
}

function isValidDescription(description) {
  const descriptionRegex = /^[A-Za-z\s0-9]+$/;
  return descriptionRegex.test(description);
}

function isValidAddress(address) {
  const addressRegex = /^[^\$.\{\}=;]+$/;
  return addressRegex.test(address);
}


// Function to get current user
exports.allUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

//Function to get number of users in database
exports.userCount = async (req, res) => {
  try {
    const userCount = await User.find().estimatedDocumentCount();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Fucntion to get number of orders created
exports.orderCount = async (req, res) => {
  try {
    const orderCount = await Order.find().estimatedDocumentCount();
    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Function to get number of products in database
exports.productCount = async (req, res) => {
  try {
    const productCount = await Product.find().estimatedDocumentCount();
    res.status(200).json({ productCount });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.userId }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
//function to update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    
    const { name, email, password, salt } = updatedFields;
    
    // Validate name
    if (!name) {
      return res.status(400).json({ message: "Please fill up your name.", success: false });
    }
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Please provide a valid name.", success: false });
    }
    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Please fill in your email.", success: false });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address.", success: false });
    }
    // Check if a user with the same email already exists
    const userWithSameEmail = await User.findOne({ email: email });
    if (userWithSameEmail && userWithSameEmail._id != userId) {
      return res.status(400).json({ message: "This email already exists.", success: false });
    }
    
    // Check if the password is missing
    if (!password) {
      return res.status(400).json({ message: "Please fill in your password.", success: false });
    }
  
    // Check if the password meets the strength criteria
    if (!schema.validate(password)) {
      return res.status(400).json({
        message:
          "Password does not meet the required strength criteria. Password should contain 15-64 characters, at least 1 special character, 1 capital letter, and 1 number.",
        success: false,
      });
    }
    req.body.name = sanitizeHtml(req.body.name);
    req.body.email = sanitizeHtml(req.body.email);
    req.body.password = sanitizeHtml(req.body.password);

    //Generate a unique salt per user
    const newSalt = crypto.randomBytes(16).toString("hex");

    //Pre-hash the new password if it's longer than the block size of 64
    let preHashedPassword = password;
    if (preHashedPassword.length > 64) {
      preHashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    }

    //Hash new password
    const newHashedPassword = crypto.pbkdf2Sync(preHashedPassword, newSalt, 600000, 64, "sha256").toString("hex");

    updatedFields.salt = newSalt;
    updatedFields.password = newHashedPassword;
    
    // Find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    res.status(200).json({
      message: "Profile updated successfully!",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Validation error
      res.status(400).json({
        message: "Validation error: " + error.message,
        success: false,
      });
    } else {
      // Send a general error response
      res.status(500).json({ message: "Internal server error", success: false });
    }
  }
};

// Function to create a form
exports.contactAdmin = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Please fill in a valid title.", success: false });
    }
    if (!isValidTitle(title)) {
      return res.status(400).json({ message: "Please provide a valid title, no special characters!", success: false });
    }
    if (!description) {
      return res.status(400).json({ message: "Please fill in a valid description.", success: false });
    }
    if (!isValidDescription(description)) {
      return res.status(400).json({ message: "Please provide a valid description, no special characters!", success: false });
    }
    req.body.title = sanitizeHtml(req.body.title);
    req.body.description = sanitizeHtml(req.body.description);
    const newForm = await new Form(req.body).save();
    // Send response
    res.status(200).json({ 
    message: "Form created successfully",
    success: true,
    form: newForm 
    });

  } catch (error) {
    // Send a general error response
    res.status(500).json({ error: "An error occurred while creating the form" });
  }
};

// Function to create user cart (User will only have one cart at a time)
exports.userCart = async (req, res) => {
  try {
    // Initialize Variables
    let products = [];
    let cartTotal = 0;

    // Get cart from request body
    const { cart } = req.body;

    // Find user by id
    const user = await User.findById({ _id: req.userId }).select("-password");

    // Check if cart with logged in user id already exist
    let userCartExist = await Cart.findOne({ orderedBy: user._id }).exec();

    // If cart exist, remove it
    if (userCartExist) {
      userCartExist.deleteOne();
    }

    // Loop through cart items to add additional fields
    for (let i = 0; i < cart.length; i++) {
      let object = {}; // temp object
      object.product = cart[i]._id;
      object.count = cart[i].count;
      // Get Price for creating total
      //(getting price from local storage may be manipulated)
      let productFromDB = await Product.findById(cart[i]._id).select("price").exec();
      object.price = productFromDB.price;
      // Push object to products array
      products.push(object);
    }

    // Loop through products to calculate total
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    // Create new cart
    let newCart = await new Cart({ products, cartTotal, orderedBy: user._id }).save();

    // Send success message as response
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    //Find user
    const user = await User.findById({ _id: req.userId }).select("-password");
    // Find cart by user id
    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
    // Deconstruct cart
    const { products, cartTotal } = cart;
    // Send cart as response
    res.status(200).json({ products, cartTotal });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.emptyUserCart = async (req, res) => {
  try {
    // Find user
    const user = await User.findById({ _id: req.userId }).select("-password");
    // Delete Cart
    const cart = await Cart.findOneAndDelete({ orderedBy: user._id }).exec();
    // Send response
    res.status(200).json({
      message: "Cart Emptied Successfully",
      success: true,
      data: cart,
    });
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.saveAddress = async (req, res) => {
  try {
    if (!req.body.address) {
      return res.status(400).json({ message: "Please fill in an address to be delivered to.", success: false });
    }
    if (!isValidAddress(req.body.address)) {
      return res.status(400).json({ message: "Please provide an address, no .$={};", success: false });
    }
    req.body.address = sanitizeHtml(req.body.address);
    // Find user and update address
    const userAddress = await User.findOneAndUpdate(
      { _id: req.userId },
      { address: req.body.address }
    ).exec();
    // Send response
    res.status(200).json({ ok: true });
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getAddress = async (req, res) => {
  try {
    // Find user
    const user = await User.findById({ _id: req.userId }).select("-password");
    // Send response
    res.status(200).json(user.address);
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.createPaymentIntent = async (req, res) => {
  // 1 find user
  const user = await User.findOne({ _id: req.userId }).exec();
  // 2 get user cart total
  const { cartTotal } = await Cart.findOne({ orderedBy: user._id }).exec();

  console.log("CART TOTAL CHARGED", cartTotal);

  let finalAmount = cartTotal * 100;

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "sgd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    payable: finalAmount,
  });
};

exports.createOrder = async (req, res) => {
  try {
    // Get payment intent from request body
    const { paymentIntent } = req.body.stripeResponse;
    // Find user
    const user = await User.findOne({ _id: req.userId }).exec();
    // Find cart by user id
    const { products } = await Cart.findOne({ orderedBy: user._id }).exec();
    // Create new order
    let newOrder = await new Order({
      products,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    // Decrement quantity, increment sold
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    // Update products
    await Product.bulkWrite(bulkOption, {});

    // Send response
    res.status(200).json({ ok: true });
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

// Fetch orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderedBy: req.userId })
      .populate("products.product") // Populate the product details
      .exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
