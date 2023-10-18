import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GetSingleUser } from "../../api/userAPI";

const UserProfile = () => {
  const [users, setUser] = useState([]);

  // Declare variables
  const { user } = useSelector((state) => state.user);

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
          <h2 className="mb-4">User Profile</h2>
          <div style={{ maxWidth: "600px" }}>
            {/* <ListGroup>
              <ListGroup.Item>Name: {users.name}</ListGroup.Item>
              <ListGroup.Item>Email: {users.email}</ListGroup.Item>
              <ListGroup.Item>Role: {users.role}</ListGroup.Item>
            </ListGroup> */}
            {/* Use input fields */}
            <Form>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder={users.name} disabled></Form.Control>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder={users.email} disabled></Form.Control>
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" placeholder={users.role} disabled></Form.Control>
            </Form>
            <a href={`/user/update-profile`}>
              <Button variant="primary" className="mt-3">
                Edit Profile
              </Button>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
