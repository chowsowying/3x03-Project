const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");
const Form = require("../models/form.model");

// Function to get current user
exports.allUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
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

exports.updateProfile = async (req, res) => {
  try {
    // Request object
    const userId = req.userId;

    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
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
