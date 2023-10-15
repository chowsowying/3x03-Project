import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

const AdminDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 overflow-auto">
          <h1>Admin Dashboard</h1>
        </Col>
      </Row>
      <Row className="px-2">
        <Col md={4}>
          <div class="card bg-danger text-white">
            <div class="card-body">
              <h4 class="card-title">#</h4>
              <p class="card-text">Number of users</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h4 class="card-title">#</h4>
              <p class="card-text">Number of Orders</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div class="card bg-success text-white">
            <div class="card-body">
              <h4 class="card-title">#</h4>
              <p class="card-text">Number of products</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} className="p-4 overflow-auto">
          <h4>All Enquiries</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
