import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/loaderSlice";
const apiUrl = import.meta.env.VITE_APP_API;
const forgotPasswordUrl = `${apiUrl}/forgot-password`;

const ForgotPassword = () => {
  // States
  const [email, setEmail] = useState("");

  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Function: Forget password
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      dispatch(setLoading(true));
      // If email is empty
      if (!email) {
        toast.error("Please enter your email address.");
        dispatch(setLoading(false));
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        dispatch(setLoading(false));
        return;
      }

      // Send request to backend
      const response = await fetch(forgotPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      dispatch(setLoading(false));

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        const resetToken = responseData.resetToken;
        // Give generic message regardless of success or failure, then redirect
        toast.success("Please complete the password reset within 5 minutes.");
        navigate(`/reset-password?resetToken=${resetToken}`);
      } else {
        // Handle the case where the response status is not ok (e.g., 400, 500)
        toast.error("Failed to initiate the password reset process.");
      }
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to initiate the password reset process.");
    }
  };

  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user]);

  return (
    <Container fluid className="bg-primary login-container-height">
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div className="card border-0 shadow rounded-3 my-5 ">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-medium fs-5">Forgot Password</h5>
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

                <hr className="my-4" />
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
