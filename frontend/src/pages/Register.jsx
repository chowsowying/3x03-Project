import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { auth } from "../firebase";

const Register = () => {
  // States
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fucntion: Handle getting registration link
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    // Config for firebase
    const config = {
      url: import.meta.env.VITE_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    // Send email to user via firebase
    await auth
      .sendSignInLinkToEmail(email, config)
      .then(() => {
        // Show toast notification
        toast.success(`Email is sent to ${email}. Click the link to complete your registration.`);

        // Save user email in local storage
        window.localStorage.setItem("registrationEmail", email);

        // Clear state
        setEmail("");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>Enter Email to Register</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Enter email"
                    className="mt-4"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4">
                  Get Registration link
                </Button>
              </Form>
              <p className="mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Register;
