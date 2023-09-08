import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../api/authAPI";

const RegisterComplete = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Declare variables
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function: Handle user registration
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    // Validate form
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }

    try {
      const response = await auth.signInWithEmailLink(email, window.location.href);

      if (response.user.emailVerified) {
        // Remove user email from local storage
        window.localStorage.removeItem("emailForRegistration");
        // Get user id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const userTokenResult = await user.getIdTokenResult();

        // Call API and send data to backend
        createOrUpdateUser(userTokenResult.token)
          .then((res) => {
            // Dispatch to redux store
            dispatch({
              type: "CURRENT_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));

        // Redirect to home page
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // useEffect
  useEffect(() => {
    // Get user email from local storage
    setEmail(window.localStorage.getItem("registrationEmail") || "");
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>Complete Registration</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Enter email"
                    className="mt-4"
                    required
                    disabled
                  />
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Enter password"
                    className="mt-4"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4">
                  Register User
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

export default RegisterComplete;
