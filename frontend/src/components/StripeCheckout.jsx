import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent, createOrder, emptyUserCart } from "../api/userAPI";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

const StripeCheckout = () => {
  // state
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [payable, setPayable] = useState(0);

  // Variables
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const stripe = useStripe();
  const elements = useElements();

  //handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: e.target.name.value },
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get result after successful payment
      // create order and save in database for admin to process
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          // empty cart from local storage
          if (typeof window !== "undefined") localStorage.removeItem("cart");
          // empty cart from redux store
          dispatch(addToCart([]));
          // empty cart from database
          emptyUserCart(user.token);
        }
      });
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(e.empty); // Disable Pay button if errors
    setError(e.error ? e.error.message : ""); // Show error message
  };

  // Hooks
  useEffect(() => {
    createPaymentIntent(user.token).then((res) => {
      console.log("create payment intent", res.data);
      setClientSecret(res.data.clientSecret);
      // additional response received from backend
      setCartTotal(res.data.cartTotal);
      setPayable(res.data.payable);
    });
  }, []);

  // Styles
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {succeeded && (
        <Container fluid>
          <Row>
            <Col lg={12} className="p-4 overflow-auto container-height">
              <h1>Payment Success</h1>
              <a href="/user/dashboard" className="btn btn-primary mt-3">
                See it in your purchase history
              </a>
            </Col>
          </Row>
        </Container>
      )}

      {!succeeded && (
        <>
          <Container fluid>
            <Row>
              <Col lg={12} className="p-4 overflow-auto container-height">
                <h1>Complete Your Purchase</h1>
                <div className="my-3">
                  <h3>Cart Total: ${cartTotal}</h3>
                  <h3>Total Payable: ${(payable / 100).toFixed(2)}</h3>
                </div>
                <form id="payment-form" className="stripe-form" onSubmit={handleSubmit} action="">
                  <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                  <button className="stripe-button" disabled={processing || disabled || succeeded}>
                    <span id="button-text">
                      {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
                    </span>
                  </button>
                  {/* Show any error that happens when processing the payment */}
                  {error && (
                    <div className="card-error mt-5" role="alert">
                      {error}
                    </div>
                  )}
                </form>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default StripeCheckout;
