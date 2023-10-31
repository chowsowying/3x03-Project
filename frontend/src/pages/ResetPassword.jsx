import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

const apiUrl = import.meta.env.VITE_APP_API;
const resetPasswordUrl = `${apiUrl}/reset-password`;

const ResetPassword = () => {
    // States
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Retrieve resetToken from URL
    const location = useLocation();
    const resetToken = new URLSearchParams(location.search).get("resetToken");

    // Declare variables
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Function: Reset password
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        try {
            // Basic validation
            dispatch(setLoading(true));
            if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                toast.error("OTP must be 6 digits long and contain only numbers");
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            // Send request to backend
            const response = await fetch(resetPasswordUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp, newPassword, confirmPassword, resetToken }),
            });

            dispatch(setLoading(false));

            if (response.ok) {
                toast.success("Password reset successfully.");
                navigate(`/login`);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            dispatch(setLoading(false));
            toast.error("Failed to reset password.");
        }

    };

    // If resetToken is not present, redirect to forgot password page
    useEffect(() => {
        if (!resetToken) {
            navigate(`/forgot-password`);
        }
    }, [resetToken, navigate]);

    return (
        <Container fluid className="bg-primary login-container-height">
            <Row>
                <Col sm={9} md={7} lg={5} className="mx-auto">
                    <div class="card border-0 shadow rounded-3 my-5 ">
                        <div class="card-body p-4 p-sm-5">
                            <h5 class="card-title text-center mb-5 fw-medium fs-5">Enter your TOTP token </h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="otp">
                                    <Form.Control
                                        type="number"
                                        value={otp}
                                        onChange={(ev) => setOtp(ev.target.value)}
                                        placeholder="Enter OTP"
                                        className="mt-4"
                                        maxLength={6}
                                    />
                                </Form.Group>
                                <Form.Group controlId="newpassword">
                                    <Form.Control
                                        type="password"
                                        value={newPassword}
                                        onChange={(ev) => setNewPassword(ev.target.value)}
                                        placeholder="New Password"
                                        className="mt-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="confirmpassword">
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                                        placeholder="Confirm Password"
                                        className="mt-4"
                                    />
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
