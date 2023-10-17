const Product = require("../models/product.model");
const User = require("../models/user.model");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  try {
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
        message: "Product name must < 32 characters",
        success: false,
      });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Product name already exists", success: false });
    } else {
      // Other errors
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
        message: "Product name must < 32 characters",
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
