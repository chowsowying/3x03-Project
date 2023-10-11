import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { GetSingleProduct } from "../../api/productAPI";
import { useParams } from "react-router-dom";

const ViewProduct = () => {
    // State
    const [product, setProduct] = useState({
      title: "",
      description: "",
      price: "",
      category: "",
      quantity: "1",
      images: [],
      condition: "",
    });
  
    // Declare variables
    const { slug } = useParams();
  
    // Function: Get Single Product
    const fetchProduct = async () => {
      try {
        const response = await GetSingleProduct(slug);
        setProduct(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
  
    // UseEffect: Fetch Single Product
    useEffect(() => {
      fetchProduct();
    }, [slug]);
  
    return (
        <Container fluid>
          <Row>
            <Col lg={12} className="bg-light p-4 container-height">
              <h1>Product Details</h1>
              <div className="d-flex flex-wrap gap-4 my-4">
                {product.images &&
                  product.images.map((image, index) => (
                    <img key={index} src={image.url} alt={image.url} width="150" height="120" />
                  ))}
              </div>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Title:</strong> {product.title}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description:</strong> {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price:</strong> ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Category:</strong> {product.category}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Quantity:</strong> {product.quantity}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Condition:</strong> {product.condition}
                </ListGroup.Item>
              </ListGroup>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <a className="btn btn-primary">
                  Add to Cart
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      );
  };
  
  export default ViewProduct;