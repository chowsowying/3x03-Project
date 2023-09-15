import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Home</h1>
          <p className="text-center">{user ? `Welcome ${user.role} -  ${user.name}` : ""}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
