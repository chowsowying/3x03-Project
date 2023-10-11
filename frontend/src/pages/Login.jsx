import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginUser } from "../api/authAPI";
import { setLoading } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";

const Login = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Function: Login user
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await LoginUser(email, password);
      dispatch(setLoading(false));
      const { user } = response.data;
      // Store user data and token in local storage
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(response.data.message);
      // Update redux
      dispatch(setUser(user));
      // Redirect if user is admin or user
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "user") navigate("/user/dashboard")
      else navigate("/");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

  // If user is logged in, prevent user from accessing login page
  // useEffect(() => {
  //   if (user && user.token) navigate("/");
  // }, [user]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Login Now</h1>
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
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Enter password"
                className="mt-4"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Don't have an account ? <Link to="/register">Register</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
