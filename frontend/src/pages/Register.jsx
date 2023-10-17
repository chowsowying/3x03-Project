import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../api/authAPI";
import { setLoading } from "../redux/loaderSlice";

const Register = () => {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Declare variables
  const dispatch = useDispatch();

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
          <div class="card border-0 shadow rounded-3 my-5 ">
            <div class="card-body p-4 p-sm-5">
              <h5 class="card-title text-center mb-5 fw-medium fs-5">Register</h5>
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
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Enter password"
                    className="mt-4"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Register
                </Button>

                <hr class="my-4" />
                {/* Login */}
                <div className="text-center">
                  <p className="mt-3">
                    Already have an account ? <Link to="/login">Login</Link>
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
