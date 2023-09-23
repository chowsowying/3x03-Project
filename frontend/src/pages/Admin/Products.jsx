import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetAllProducts, DeleteProduct } from "../../api/productAPI";

const Products = () => {
  // State
  const [products, setProducts] = useState([]);

  //Variables
  const { user } = useSelector((state) => state.user);

  //Function: Get All Products
  const fetchProducts = async () => {
    try {
      const response = await GetAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Function: Delete Product
  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await DeleteProduct(slug, user.token);
        toast.success(response.data.message);
        fetchProducts();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  // UseEffect: Fetch All Products
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 overflow-auto container-height">
          {/* Product Title and Add Product Btn */}
          <div className="d-flex justify-content-between align-items-center">
            <h1>Products</h1>
            <a href="/admin/create-product" className="btn btn-primary">
              Create Product
            </a>
          </div>
          {/* Search Bar */}
          <div className="mt-4">
            <input type="text" className="form-control" placeholder="Search Product" />
          </div>
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
                            href={`/admin/update-product/${product.slug}`}
                            className="btn btn-primary">
                            Edit
                          </a>
                          <a onClick={() => handleDelete(product.slug)} className="btn btn-danger">
                            Delete
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

export default Products;
