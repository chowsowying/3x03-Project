import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

const ForgotPassword = () => {
  // States
  const [email, setEmail] = useState("");

  // Declare variables
  const dispatch = useDispatch();

  // Function: Forget password
  // TODO: Fix the linking of frontend to backend
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      dispatch(setLoading(true));
      
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      await response.json();
  
      // Check if the response indicates failure
      if (!response.success) {
        toast.error(response.message);
      }
  
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to initiate the password reset process.");
    }
  };

  return (
    <Container fluid className="bg-primary login-container-height">
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div class="card border-0 shadow rounded-3 my-5 ">
            <div class="card-body p-4 p-sm-5">
              <h5 class="card-title text-center mb-5 fw-medium fs-5">Forgot Password</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Enter email"
                    className="mt-4"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Reset Password
                </Button>

                <hr class="my-4" />
                {/* Login */}
                <div className="text-center">
                  <p className="mt-3">
                    Remember your password ? <Link to="/login">Login</Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
