const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// Function to get current user
exports.allUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
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
