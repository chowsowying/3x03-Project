const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

// Test: For getting all the products (public route)
describe("GET /api/products", () => {
  it("should get all the products", async () => {
    const response = await request(app).get("/api/products").set({
      "Content-Type": "application/json",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

//Test: For getting a single product (public route)
describe("GET /api/product/:slug", () => {
  it("should get a single product", async () => {
    const response = await request(app).get("/api/product/macbook-pro-m2-14").set({
      "Content-Type": "application/json",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title");
  });
});

//Test: For creating a new product (private route)
describe("POST /api/product", () => {
  it("should create a new product", async () => {
    // Getting the token
    const token = await request(app).post("/api/login").send({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    });

    // Parse the response JSON
    const responseBody = JSON.parse(token.text);

    // Access the token
    const authToken = responseBody.user.token;

    const product = {
      title: "Test Product",
      description: "This is a test product",
      price: "100",
      category: "Electronics",
      quantity: 1,
      condition: "New",
      images: [],
    };

    const response = await request(app)
      .post("/api/product")
      .set("authtoken", authToken) // Set the header 'authtoken' with the authToken value
      .send(product); // Send the product data

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("title");
  });
});

//Test: For updating a product (private route)
describe("PUT /api/product/:slug", () => {
  it("should update a product", async () => {
    // Getting the token
    const token = await request(app).post("/api/login").send({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    });

    // Parse the response JSON
    const responseBody = JSON.parse(token.text);

    // Access the token
    const authToken = responseBody.user.token;

    const product = {
      title: "Test Product 2",
      description: "This is a test product",
      price: "100",
      category: "Electronics",
      quantity: 1,
      condition: "New",
      images: [],
    };

    const response = await request(app)
      .put("/api/product/test-product")
      .set("authtoken", authToken) // Set the header 'authtoken' with the authToken value
      .send(product); // Send the product data

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("title");
  });
});

//Test: For deleting a product (private route)
describe("DELETE /api/product/:slug", () => {
  it("should delete a product", async () => {
    // Getting the token
    const token = await request(app).post("/api/login").send({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    });

    // Parse the response JSON
    const responseBody = JSON.parse(token.text);

    // Access the token
    const authToken = responseBody.user.token;

    const response = await request(app)
      .delete("/api/product/test-product-2")
      .set("authtoken", authToken); // Set the header 'authtoken' with the authToken value

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("title");
  });
});
