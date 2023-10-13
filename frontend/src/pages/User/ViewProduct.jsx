import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { GetSingleProduct } from "../../api/productAPI";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { addToCart } from "../../redux/cartSlice";

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
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Function: Get Single Product
  const fetchProduct = async () => {
    try {
      const response = await GetSingleProduct(slug);
      setProduct(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Fucntion: Add to Cart
  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // If cart is in local storage, get it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // If cart does not exist, push new product to cart and save to local storage
      cart.push({ ...product, count: 1 });
      // remove duplicates from cart array before adding to local storage
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      localStorage.setItem("cart", JSON.stringify(unique));
      // add to redux state
      dispatch(addToCart(unique));
      // show toast
      toast.success("Added to cart");
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
            {/* Disabled if quantity is 0 */}
            {product.quantity > 0 ? (
              <button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
              </button>
            ) : (
              <button disabled className="btn btn-dark">
                Out of Stock
              </button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProduct;
