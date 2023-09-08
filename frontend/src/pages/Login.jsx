import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { auth, googleAuthProvider } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { createOrUpdateUser } from "../api/authAPI";

const Login = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));

  // Function: Handle role-based redirect
  const handleRedirectUser = (res) => {
    if (res.data.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  // Function: Handle user login
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      const { user } = response;
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
              token: userTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          // Redirect based on user role
          handleRedirectUser(res);
          toast.success("Login Successfull");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (res) => {
        const { user } = res;
        const idTokenResult = await user.getIdTokenResult();

        // Call API and send data to backend
        createOrUpdateUser(idTokenResult.token)
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
            // Redirect based on user role
            handleRedirectUser(res);
            toast.success("Login successfull");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                <Button variant="danger" className="mt-4" onClick={handleGoogleLogin}>
                  Login with Google
                </Button>
              </Form>
              <p className="mt-3">
                Don't have an account ? <Link to="/register">Register</Link>
              </p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Login;
