const express = require("express");
const router = express.Router();

// Middlewares
const { isAuth, isAdmin, isUser } = require("../middlewares/auth.middleware");

//controllers
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../controllers/product.controller");

// routes

// Create new product
router.post("/product", isAuth, isAdmin, createProduct);
// Get all products
router.get("/products", getAllProducts);
// Get single product
router.get("/product/:slug", getSingleProduct);
// Update product
router.put("/product/:slug", isAuth, isAdmin, updateProduct);
// Delete product
router.delete("/product/:slug", isAuth, isAdmin, deleteProduct);
//Get Related Products
router.get("/product/related/:slug", getRelatedProducts);

module.exports = router;
