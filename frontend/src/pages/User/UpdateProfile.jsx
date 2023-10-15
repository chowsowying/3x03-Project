import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Form } from "react-bootstrap/";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UpdateSingleProfile} from "../../api/userAPI";
import { setLoading } from "../../redux/loaderSlice";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const values = {
    name,
    email,
    password,
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  //Function: Update Profile
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await UpdateSingleProfile(values, user.token);
      dispatch(setLoading(false));
      toast.success(response.data.message);
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 overflow-auto container-height">
          <h1 className="mb-4">Update Profile</h1>
          <div style={{ maxWidth: '650px' }}>
            <Form>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form>
            <br/>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 15-64 characters long, contains one special character, capital letter, and number.
            </Form.Text>
            <a>
              <Button onClick={handleClick} variant="primary" className="mt-3">Update</Button>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
  
  export default UpdateProfile;