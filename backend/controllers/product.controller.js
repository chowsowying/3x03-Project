const Product = require("../models/product.model");
const User = require("../models/user.model");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const sanitizeHtml = require("sanitize-html");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedCharacters = /^[^\$.\{\}=;]+$/;
const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

//Input Validation function check for title
function isValidTitleCheck(data) {
  if (
    data.title.trim() === "" ||
    typeof data.title !== "string" ||
    !allowedCharacters.test(data.title)
  ) {
    return false;
  }
  return true;
}

//Input Validation function check for description
function isValidDescriptionCheck(data) {
  if (
    data.description.trim() === "" ||
    typeof data.description !== "string" ||
    !allowedCharacters.test(data.description)
  ) {
    return false;
  }
  return true;
}

//Input Validation function check for price
function isValidPriceCheck(data) {
  if (data.price.trim() === "" || data.price <= 0 || !priceRegex.test(data.price.toString())) {
    return false;
  }
  return true;
}

exports.createProduct = async (req, res) => {
  try {
    //Input Validation function call for title
    if (!isValidTitleCheck(req.body)) {
      return res.status(400).json({
        message: "Invalid input data on title! Please no use $.{}=",
        success: false,
      });
    } else if (!isValidDescriptionCheck(req.body)) {
      return res.status(400).json({
        message: "Invalid input data on description! Please no use $.{}=",
        success: false,
      });
    } else if (!isValidPriceCheck(req.body)) {
      return res.status(400).json({
        message: "That is not a valid price!",
        success: false,
      });
    }
    //sanitise the input data
    req.body.title = sanitizeHtml(req.body.title);
    req.body.description = sanitizeHtml(req.body.description);

    //Get title from request body and slugify it
    req.body.slug = slugify(req.body.title);
    // Create new product
    const newProduct = await new Product(req.body).save();
    // Send response
    res.status(200).json({
      message: "Product created successfully",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Validation error
      res.status(400).json({
        message: "Product name must < 32 characters and Description must be < 2000",
        success: false,
      });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Product name already exists", success: false });
    } else {
      // Other errors
      console.log(error);
      res.status(400).json({ message: "Failed to create product", success: false });
    }
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find({});

    // Send response
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: "Failed to get products", success: false });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    // Get product
    const product = await Product.findOne({ slug: req.params.slug }).exec();
    // Send response
    res.status(200).json(product);
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    //Input Validation function call for title
    if (!isValidTitleCheck(req.body)) {
      return res.status(400).json({
        message: "Invalid input data on title! Please no use $.{}=",
        success: false,
      });
    } else if (!isValidDescriptionCheck(req.body)) {
      return res.status(400).json({
        message: "Invalid input data on description! Please no use $.{}=",
        success: false,
      });
    } else if (!isValidPriceCheck(req.body)) {
      return res.status(400).json({
        message: "That is not a valid price!",
        success: false,
      });
    }
    //sanitise the input data
    req.body.title = sanitizeHtml(req.body.title);
    req.body.description = sanitizeHtml(req.body.description);

    // Get title from request body and slugify it
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Update product
    const updatedProduct = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    }).exec();
    // Send response
    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Validation error
      res.status(400).json({
        message: "Product name must < 32 characters and Description must be < 2000",
        success: false,
      });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Product name already exists", success: false });
    }
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Delete product
    const deletedProduct = await Product.findOneAndDelete({ slug: req.params.slug }).exec();
    // Send response
    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      data: deletedProduct,
    });
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    // Get product
    const product = await Product.findOne({ slug: req.params.slug }).exec();
    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(3);
    // Send response
    res.status(200).json(relatedProducts);
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.removeImage = async (req, res) => {
  try {
    // Get public_id from request body
    const { public_id } = req.body;
    console.log(public_id);
    // Delete image from cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    // Send response
    res.status(200).json({ message: "Image deleted successfully", success: true });
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message, success: false });
  }
};
