import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../api/authAPI";
import { setLoading } from "../redux/loaderSlice";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("weak");

  const dispatch = useDispatch();

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
    } else if ((isLengthValid && hasSpecialChar && hasNumber)
    ) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

    // Function to handle reCAPTCHA response
    const handleRecaptchaChange = (value) => {
      // Set the reCAPTCHA response in the state
        setRecaptchaResponse(value);
    };

  // Function: Register user
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await RegisterUser(name, email, password);
      dispatch(setLoading(false));
      toast.success(response.data.message);
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

  return (
    <Container fluid className="bg-primary login-container-height">
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-medium fs-5">Register</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Control
                    type="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder="Enter Name"
                    className="mt-4"
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Enter email"
                    className="mt-4"
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(ev) => {
                      setPassword(ev.target.value);
                      calculatePasswordStrength(ev.target.value);
                    }}
                    placeholder="Enter password"
                    className="mt-4"
                  />
                  <div className={`strength-bar strength-${passwordStrength}`}></div>
                </Form.Group>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_CLIENT_KEY}
                    onChange={handleRecaptchaChange}
                  />
                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Register
                </Button>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="mt-3">
                    Already have an account? <Link to="/login">Login</Link>
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

export default Register;
