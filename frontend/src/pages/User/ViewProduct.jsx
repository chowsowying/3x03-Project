import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { GetSingleProduct, GetRelatedProduct } from "../../api/productAPI";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { addToCart } from "../../redux/cartSlice";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
  const [relatedProduct, setRelatedProduct] = useState([]);

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

  // Function: Get Related Products
  const fetchRelatedProduct = async () => {
    try {
      const response = await GetRelatedProduct(slug);
      setRelatedProduct(response.data);
      console.log(response.data);
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
    fetchRelatedProduct();
  }, [slug]);

  return (
    <Container fluid>
      <Row className="container-height overflow-auto">
        <Col lg={4} md={6} sm={12} className=" p-4">
          <Carousel showArrows={true} autoPlay infiniteLoop showStatus={false} showThumbs={false}>
            {product.images &&
              product.images.map((image) => (
                <div key={image.public_id} className="p-3 border">
                  <img src={image.url} alt={product.title} className="object-fit-contain" />
                </div>
              ))}
          </Carousel>
        </Col>
        <Col lg={8} md={6} sm={12} className="p-4 d-flex flex-column justify-content-between">
          <div>
            <h1 className="fw-bold mb-4">{product.title}</h1>
            <ListGroup>
              <ListGroup.Item>
                <strong>Description:</strong> {product.description}
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
          </div>
          <div className="d-flex gap-4 align-items-center mt-4">
            <h1 className="text-danger fw-bold">${product.price}</h1>
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
        {/* Related Products */}
        <Col className="p-4">
          <h2 className="fw-bold">Related Products</h2>
          <Row>
            {relatedProduct.length > 0 ? (
              relatedProduct.map((product) => (
                <Col lg={3} md={4} sm={6} key={product._id}>
                  <div className="card m-2 h-100">
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="card-img-top object-fit-contain p-3"
                      height="180"
                      width="180"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text">${product.price}</p>
                      <a href={`/user/view-product/${product.slug}`} className="btn btn-primary">
                        View Product
                      </a>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <h3 className="text-danger mt-2">No Related Products</h3>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProduct;
