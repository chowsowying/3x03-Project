import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import { GetAllProducts } from "../api/productAPI";

const Home = () => {
  // State
  const [products, setProducts] = useState([]);

  //Function: Get All Products
  const fetchProducts = async () => {
    try {
      const response = await GetAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // UseEffect: Fetch All Products
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={2} className="p-4 overflow-auto container-height">
          To be implemented filter by price range, filter by category, filter by condition , clear
          filter
        </Col>
        <Col lg={10} className="p-4 overflow-auto container-height">
          {/* Search Bar */}
          <input type="text" className="form-control" placeholder="Search Product" />
          {/* Product Card Container */}
          <div className="mt-4">
            <Row>
              {/* Product Card */}
              {products &&
                products.map((product) => (
                  <Col lg={3} md={6} className="mb-4">
                    <div className="card" key={product._id}>
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].url
                            : "https://via.placeholder.com/200x200.png?text=Product+Image"
                        }
                        className="card-img-top"
                        height="200"
                        width="200"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description.substring(0, 100)}</p>
                        <p className="card-text">${product.price}</p>
                        <div className="d-flex gap-2">
                          <a
                            href={`/user/view-product/${product.slug}`}
                            className="btn btn-primary">
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
