import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Sidebar from "../../components/Sidebar";

const Products = () => {
  return (
    <Container fluid>
      <Row>
        <Col lg={2} md={4} xs={2} className="m-0 p-0">
          <Sidebar />
        </Col>
        <Col lg={10} md={8} xs={10} className="bg-light p-4 overflow-auto container-height ">
          <h1>Products</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
