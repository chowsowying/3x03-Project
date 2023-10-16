import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import { GetAllProducts } from "../api/productAPI";
import { AiFillEye } from "react-icons/ai";

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
        <Col lg={12} className="px-4 overflow-auto container-height">
          {/* Header Image */}
          <img
            src="https://res.cloudinary.com/dstpxts8k/image/upload/v1697473674/daesxgn3xxoz9sctj81d.jpg"
            className="img-fluid w-100 h-75 object-fit-cover"
            alt="Header"
          />
          <Row className="mt-4">
            <Col lg={2} className="">
              To be implemented filter by price range, filter by category, filter by condition ,
              clear filter
            </Col>
            <Col lg={10} className=" ">
              {/* Search Bar */}
              <input type="text" className="form-control" placeholder="Search Product" />
              {/* Product Card Container */}
              <div className="mt-4">
                <Row>
                  {/* Product Card */}
                  {products &&
                    products.map((product) => (
                      <Col lg={3} md={6} className="mb-4">
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
