const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cors = require("cors");

// Dotenv
require("dotenv").config();

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(cors());

//Database
require("./configs/MongoDbConfig");

// Routes---------------------------------------

// Auth Routes
const authRoutes = require("./routes/auth.route");
app.use("/api", authRoutes);

// User Routes
const userRoutes = require("./routes/user.route");
app.use("/api", userRoutes);

// Product Routes
const productRoutes = require("./routes/product.route");
app.use("/api", productRoutes);

// Admin Routes
const adminRoutes = require("./routes/admin.route");
app.use("/api", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Server
const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
