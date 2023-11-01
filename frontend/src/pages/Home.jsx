import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { GetAllProducts } from "../api/productAPI";
import { AiFillEye } from "react-icons/ai";

const Home = () => {
  // State
  const [allProducts, setAllProducts] = useState([]); // Separate array to store all products
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Function: Get All Products
  const fetchProducts = async () => {
    try {
      const response = await GetAllProducts();
      setProducts(response.data);
      setAllProducts(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function: Search products by keywords
  const searchHandler = (e) => {
  e.preventDefault();

  const searchKeyword = keyword.toLowerCase();

  // Define a whitelist of allowed characters (letters, digits, spaces)
  const allowedCharacters = /[A-Za-z0-9\s]/g;

  // Sanitize and keep only the allowed characters, and limit to 32 characters
  let sanitizedKeyword = searchKeyword.match(allowedCharacters);
  sanitizedKeyword = sanitizedKeyword ? sanitizedKeyword.slice(0, 32).join("") : "";
  
  if (sanitizedKeyword === "") {
    // If the search keyword is empty, fetch all products
    fetchProducts();
  } else {
    // Filter products based on the sanitized keyword present in title or description
    const filteredProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(sanitizedKeyword) ||
        product.description.toLowerCase().includes(sanitizedKeyword)
    );
    setProducts(filteredProducts);
  }
};

  // Function: Handle Category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    filterProducts(category, selectedPrice, selectedCondition);
  };

  // Function: Handle Price change
  const handlePriceChange = (e) => {
    const priceRange = e.target.value;
    setSelectedPrice(priceRange);

    filterProducts(selectedCategory, priceRange, selectedCondition);
  };

  // Function to get the price range based on the selected radio button
  const getPriceRange = (selectedPrice) => {
    switch (selectedPrice) {
      case "$Under $50":
        return [0, 49];
      case "$50-100":
        return [50, 100];
      case "$100-300":
        return [101, 300];
      case "Over $300":
        return [301, Number.MAX_VALUE];
      default:
        return [0, Number.MAX_VALUE];
    }
  };

  // Function: Handle Condition change
  const handleConditionChange = (e) => {
    const condition = e.target.value;
    setSelectedCondition(condition);

    filterProducts(selectedCategory, selectedPrice, condition);
  };

  // Function to filter products based on category, price, and condition
  const filterProducts = (category, priceRange, condition) => {
    let filteredProducts = allProducts;

    // Filter by Category
    if (category !== "All") {
      filteredProducts = filteredProducts.filter((product) => product.category === category);
    }
    // Filter by Price
    if (priceRange) {
      const [minPrice, maxPrice] = getPriceRange(priceRange);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }
    // Filter by Condition
    if (condition) {
      filteredProducts = filteredProducts.filter((product) => product.condition === condition);
    }
    setProducts(filteredProducts);
  };

  // Function: Reset all filters and deselect radio buttons
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedPrice("");
    setSelectedCondition("");
    setProducts(allProducts);
  };

  // UseEffect: Fetch All Products
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="px-4 overflow-auto container-height">
          {/* Header Image */}
          <img
            src="https://res.cloudinary.com/dstpxts8k/image/upload/v1697473674/daesxgn3xxoz9sctj81d.jpg"
            className="img-fluid w-100 h-75 object-fit-cover"
            alt="Header"
          />
          <Row className="mt-4">
            <Col lg={1} className="">
              {/* Filters */}
              <div className="mb-2" style={{ fontSize: "24px", fontWeight: "bold" }}>
                Category
              </div>
              {[
                "All",
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Clothes",
                "Beauty",
                "Sports",
                "Outdoor",
                "Home",
              ].map((category) => (
                <Form.Check
                  type="radio"
                  name="category"
                  label={category}
                  value={category}
                  checked={selectedCategory === category}
                  onChange={handleCategoryChange}
                  key={category}
                />
              ))}
              <div className="mb-2" style={{ fontSize: "24px", fontWeight: "bold" }}>
                Price
              </div>
              {["$Under $50", "$50-100", "$100-300", "Over $300"].map((priceRange) => (
                <Form.Check
                  type="radio"
                  name="price"
                  label={priceRange}
                  value={priceRange}
                  checked={selectedPrice === priceRange}
                  onChange={handlePriceChange}
                  key={priceRange}
                />
              ))}
              <div className="mb-2" style={{ fontSize: "24px", fontWeight: "bold" }}>
                Condition
              </div>
              {["New", "Excellent", "Average", "Poor"].map((condition) => (
                <Form.Check
                  type="radio"
                  name="condition"
                  label={condition}
                  value={condition}
                  checked={selectedCondition === condition}
                  onChange={handleConditionChange}
                  key={condition}
                />
              ))}
              <button type="button" className="btn btn-danger mt-4 w-100" onClick={resetFilters}>
                Reset
              </button>
            </Col>
            <Col lg={11} className=" ">
              {/* Search Bar */}
              <form onSubmit={searchHandler} className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Product"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="col-auto">
                  <Button type="submit" className="btn btn-primary">
                    Search
                  </Button>
                </div>
              </form>
              {/* Product Card Container */}
              <div className="mt-4">
                <Row>
                  {/* Product Card */}
                  {products &&
                    products.map((product) => (
                      <Col lg={3} md={6} className="mb-4" key={product._id}>
                        <div className="card h-100" key={product._id}>
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0].url
                                : "https://via.placeholder.com/200x200.png?text=Product+Image"
                            }
                            className="card-img-top object-fit-contain p-3"
                            height="180"
                            width="180"
                          />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{product.title}</h5>
                            <p
                              className="card-text"
                              style={{ maxHeight: "80px", overflow: "hidden" }}>
                              {product.description.substring(0, 80)}
                            </p>
                            <p className="card-text fw-bold text-danger">${product.price}</p>
                            <div className="mt-auto">
                              <div className="d-flex gap-2">
                                <a
                                  href={`/user/view-product/${product.slug}`}
                                  className="btn btn-primary d-flex  gap-2 justify-content-center align-items-center">
                                  <AiFillEye /> View
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
