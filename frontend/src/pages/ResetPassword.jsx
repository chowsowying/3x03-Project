import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

// TODO: Prevent the user from accessing this page if no resetToken parameter is present in the URL
// Although it would never succeed anyway

const ResetPassword = () => {
    // States
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Retrieve resetToken from URL
    const location = useLocation();
    const resetToken = new URLSearchParams(location.search).get("resetToken");

    // Declare variables
    const dispatch = useDispatch();

    // Function: Reset password
    // TODO: Fix redirect after successful password reset
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
            const response = await fetch("http://localhost:4000/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp, newPassword, confirmPassword, resetToken }),
            });

            dispatch(setLoading(false));

            if (response.ok) {
                toast.success("Password reset successfully.");
                // TODO: There is a toast that says password reset failed even though it succeeded, remove it
                // TODO: This redirect doesn't work, fix it
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            dispatch(setLoading(false));
            toast.error("Failed to reset password.");
        }

    };

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
                                        type="text"
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
