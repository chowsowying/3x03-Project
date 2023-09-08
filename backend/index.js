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

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
