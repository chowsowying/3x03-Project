import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { userCart } from "../api/userAPI";
import { setLoading } from "../redux/loaderSlice";

const Cart = () => {
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Fucntion: Save cart to database
  const handleSaveCartToDatabase = () => {
    dispatch(setLoading(true));
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          dispatch(setLoading(false));
          navigate("/checkout");
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err.response.data.message);
      });
  };

  //Fucntion: Remove from cart
  const handleCartRemove = (productId) => {
    if (typeof window !== "undefined") {
      // Get the cart from local storage
      let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

      // Remove the product from the cart
      const updatedCart = cart.filter((product) => product._id !== productId);

      // Save the updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Save the updated cart to Redux
      dispatch(addToCart(updatedCart));

      // Show toast
      toast.error("Product removed from cart");
    }
  };

  //Fucntion: Handle Cart Total
  const handleCartTotal = () => {
    return cart.reduce(
      (currentValue, nextValue) => currentValue + nextValue.price * nextValue.count,
      0
    );
  };

  return (
    <Container fluid>
      <Row>
        {cart.length > 0 ? (
          <>
            {/* Right Side - Cart Items */}
            <Col lg={8} className="p-4 overflow-auto container-height">
              <div className="d-flex flex-row justify-content-between">
                <h2>Cart</h2>
                <h2>{cart.length} products</h2>
              </div>
              <hr />
              {/* Cart Item List */}
              <div>
                {cart.map((c, i) => (
                  <div
                    key={i}
                    className="d-flex flex-row justify-content-between align-items-center mb-5">
                    <div className="d-flex flex-row align-items-center gap-5">
                      {/* Image */}
                      <div className="cart-image-container ">
                        {c.images && c.images.length > 0 ? (
                          <img src={c.images[0].url} alt={c.title} className="img-fluid" />
                        ) : (
                          <span>No Image Available</span>
                        )}
                      </div>
                      {/* Title and color */}
                      <div className="d-flex flex-column">
                        <h2>{c.title}</h2>
                        <h3>${c.price}</h3>
                      </div>
                    </div>
                    <div className="d-flex flex-row gap-5 align-items-center">
                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          handleCartRemove(c._id);
                        }}
                        className="btn btn-danger fw-bold">
                        Remove Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Continue Shopping */}
              <div className="d-flex justify-content-end">
                <a href="/" className="btn btn-primary">
                  Continue Shopping
                </a>
              </div>
            </Col>

            {/* Left Side - Order Summery */}
            <Col lg={4} className="p-4 overflow-auto container-height bg-light">
              <h2 className="mb-4">Order Summery</h2>
              <hr />
              <div className="d-flex flex-column justify-content-between">
                <div>
                  {cart.map((c, i) => (
                    <div key={i} className="">
                      <p className="mb-3">
                        {c.title} x {c.count} = ${c.price * c.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <hr />
                  <h1 className="text-2xl fw-bold my-5">Total: ${handleCartTotal()}</h1>
                  {user ? (
                    <button onClick={handleSaveCartToDatabase} className="btn btn-primary w-100">
                      Proceed to checkout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="btn btn-primary w-100">
                      Login to Checkout
                    </button>
                  )}
                </div>
              </div>
            </Col>
          </>
        ) : (
          <h4>No products in cart</h4>
        )}
      </Row>
    </Container>
  );
};

export default Cart;
