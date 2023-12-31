import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

const apiUrl = import.meta.env.VITE_APP_API;
const resetPasswordUrl = `${apiUrl}/reset-password`;

const ResetPassword = () => {
  // States
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("weak");
  // Retrieve resetToken from URL
  const location = useLocation();
  const resetToken = new URLSearchParams(location.search).get("resetToken");

  // Declare variables
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Function to calculate password strength
  const calculatePasswordStrength = (input) => {
    const lengthRegex = /^.{15,64}$/;
    const specialCharRegex = /[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:'",<>\./?\\|`~]/;
    const capitalLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    const isLengthValid = lengthRegex.test(input);
    const hasSpecialChar = specialCharRegex.test(input);
    const hasCapitalLetter = capitalLetterRegex.test(input);
    const hasNumber = numberRegex.test(input);

    if (isLengthValid && hasSpecialChar && hasCapitalLetter && hasNumber) {
      setPasswordStrength("strong");
    } else if (isLengthValid && hasSpecialChar && hasNumber) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  // Function: Reset password
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      dispatch(setLoading(true));
      // If any field is empty
      if (!otp || !newPassword || !confirmPassword) {
        toast.error("All fields are required.");
        dispatch(setLoading(false));
        return;
      }

      // If OTP is not 6 digits long or contains non-numbers
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        toast.error("OTP must be 6 digits long and contain only numbers.");
        dispatch(setLoading(false));
        return;
      }

      // If password doesn't match confirm password
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        dispatch(setLoading(false));
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
      toast.error("Failed to reset the password. Please try again.");
    }
  };

  // If resetToken is not present, redirect to forgot password page
  useEffect(() => {
    if (!resetToken) {
      navigate(`/forgot-password`);
    }
  }, [resetToken, navigate]);

  // If user is logged in, prevent user from accessing reset password page
  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user]);

  return (
    <Container fluid className="bg-primary login-container-height">
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div class="card border-0 shadow rounded-3 my-5 ">
            <div class="card-body p-4 p-sm-5">
              <h5 class="card-title text-center mb-5 fw-medium fs-5">Enter your OTP and new password</h5>
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
                    onChange={(ev) => {
                      calculatePasswordStrength(ev.target.value);
                      setNewPassword(ev.target.value);
                    }}
                    placeholder="New Password"
                    className="mt-4"
                  />
                </Form.Group>
                <Form.Group controlId="confirmpassword">
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(ev) => {
                      calculatePasswordStrength(ev.target.value);
                      setConfirmPassword(ev.target.value);
                    }}
                    placeholder="Confirm Password"
                    className="mt-4"
                  />
                  <div className={`mb-3 strength-bar strength-${passwordStrength}`}></div>
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
