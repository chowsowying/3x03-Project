import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import "../stripe.css";

// Load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Payment = () => {
  // Variables
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="">
          <Elements stripe={promise}>
            <StripeCheckout />
          </Elements>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
