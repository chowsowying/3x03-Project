import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getUserCart, emptyUserCart, saveUserAddress, getAddress } from "../api/userAPI";
import { setLoading } from "../redux/loaderSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

const Checkout = () => {
  // State
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");

  // Variables
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fucntion: Get User Address
  const handleGetUserAddress = () => {
    getAddress(user.token).then((res) => {
      if (res.data) {
        setAddress(res.data);
      } else {
        setAddress("");
      }
    });
  };

  // Fucntion: Save Address
  const handleSaveAddress = () => {
    dispatch(setLoading(true));
    saveUserAddress(address, user.token)
      .then((res) => {
        if (res.data.ok) {
          dispatch(setLoading(false));
          toast.success("Address saved");
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err.response.data.message);
      });
  };

  // Fucntion: Get User Cart
  const handleGetUserCart = () => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  };

  // Fucntion: Empty User Cart
  const handleEmptyCart = () => {
    // Remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // Remove from redux
    dispatch(addToCart([]));
    // Remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.success(res.data.message);
    });
    // Redirect
    navigate("/cart");
  };

  //useEffect: Get user cart and address
  useEffect(() => {
    handleGetUserCart();
    handleGetUserAddress();
  }, []);

  return (
    <Container fluid>
      <Row>
        {/* Right Side - Address */}
        <Col lg={8} className="p-4 overflow-auto container-height">
          <h2 className="mb-4">Checkout</h2>
          <hr />

          {address ? (
            <h3 className="mb-4">
              Shipping Address: <span className="fw-normal"> {address}</span>
            </h3>
          ) : (
            <h3 className="mb-4">No address saved</h3>
          )}

          {/* Update Address */}
          <h3 className="">Update Address</h3>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />

          {/* Save Address */}
          <button onClick={handleSaveAddress} className="btn btn-primary mt-3">
            Save Address
          </button>
        </Col>

        {/* Left Side - Order Summery */}
        <Col lg={4} className="p-4 overflow-auto container-height bg-light">
          <h2 className="mb-4">Order Summery</h2>
          <hr />
          <div className="d-flex flex-column justify-content-between">
            <div>
              {products.map((p, i) => (
                <div key={i} className="">
                  <p className="mb-3">
                    {p.product.title} x {p.count} = ${p.product.price * p.count}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <hr />
              <h1 className="text-2xl fw-bold my-5">Total: ${total}</h1>
              {address ? (
                <button onClick={() => navigate("/payment")} className="btn btn-primary w-100">
                  Proceed to Payment
                </button>
              ) : (
                <p>Please enter your address first to checkout</p>
              )}

              {/* Empty Cart */}
              <button onClick={handleEmptyCart} className="btn btn-danger w-100 mt-4">
                Empty Cart
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
