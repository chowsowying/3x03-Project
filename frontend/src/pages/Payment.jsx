import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Payment = () => {
  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 overflow-auto container-height">
          <h1>Payment</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
