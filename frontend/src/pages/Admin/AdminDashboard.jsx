import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the backend endpoint for all users
    fetch("/api/all-users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Admin Dashboard</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
            </table>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;