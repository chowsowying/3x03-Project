import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

//TODO: Prevent the user from accessing this page if no email parameter is present in the URL

const ResetPassword = () => {
  // States
  const [otp, setOtp] = useState("");

  // Declare variables
  const dispatch = useDispatch();

  // Function: Reset password
  // TODO: Fix the linking of frontend to backend
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("OTP must be 6 digits long and contain only numbers");
      return;
    }
    dispatch(setLoading(true));
    // Call API to reset password
    dispatch(setLoading(false));
  };

  return (
    <Container fluid className="bg-primary login-container-height">
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div className="card border-0 shadow rounded-3 my-5 ">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-medium fs-5">Enter your TOTP token </h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="otp">
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(ev) => setOtp(ev.target.value)}
                    placeholder="Enter OTP"
                    className="mt-4"
                    maxLength={6}
                  />
                </Form.Group>
                <Form.Group controlId="newpassword">
                  <Form.Control type="password" placeholder="New Password" className="mt-4" />
                </Form.Group>
                <Form.Group controlId="confirmpassword">
                  <Form.Control type="password" placeholder="Confirm Password" className="mt-4" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Reset Password
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
