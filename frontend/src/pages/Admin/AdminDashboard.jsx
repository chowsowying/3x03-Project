import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AdminDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col lg={12} className=" p-4 ms-2 overflow-auto container-height">
          <h1>Admin Dashboard</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
