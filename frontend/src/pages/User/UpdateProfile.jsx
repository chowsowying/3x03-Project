import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Form } from "react-bootstrap/";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UpdateSingleProfile, GetSingleUser } from "../../api/userAPI";
import { setLoading } from "../../redux/loaderSlice";

const UpdateProfile = () => {
  const [users, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const values = {
    name,
    email,
    password,
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if the passwords match when the user types
    if (reenteredPassword !== password) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  }, [password, reenteredPassword]);

  // Function: Update Profile
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await UpdateSingleProfile(values, user.token);
      dispatch(setLoading(false));
      toast.success(response.data.message);
      // Reload the page after a successful update
      window.location.reload();
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

  // Function: Get Single User
  const fetchUser = async () => {
    try {
      const response = await GetSingleUser(user.token);
      setUser(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // UseEffect: Fetch Single User
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 overflow-auto container-height">
          <h2 className="mb-4">Update Profile</h2>
          <div style={{ maxWidth: "650px" }}>
            <Form>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={users.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form>
            <br />
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={users.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control
              type="password"
              id="reenteredPassword"
              value={reenteredPassword}
              onChange={(e) => setReenteredPassword(e.target.value)}
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 15-64 characters long, contains one special character, capital
              letter, and number.
            </Form.Text>
            {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>}
            <a>
              <Button
                onClick={handleClick}
                variant="primary"
                className="mt-3"
                disabled={passwordMatchError !== ""}>
                Update
              </Button>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfile;
