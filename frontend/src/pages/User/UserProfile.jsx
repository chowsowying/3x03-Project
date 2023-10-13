import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
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
          <h1 className="mb-4">User Profile</h1>
          <div style={{ maxWidth: '600px' }}>
            <ListGroup>
              <ListGroup.Item>Name: {user.name}</ListGroup.Item>
              <ListGroup.Item>Email: {user.email}</ListGroup.Item>
              <ListGroup.Item>Role: {user.role}</ListGroup.Item>
            </ListGroup>
            <a href={`/user/update-profile`}>
            <Button variant="primary" className="mt-3">Edit Profile</Button>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;