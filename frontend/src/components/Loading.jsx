import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const Loading = () => {
  return (
    <div className="loading-overlay">
      <Container className="d-flex justify-content-center align-items-center admin-container-height">
        <Spinner animation="border" role="status" />
      </Container>
    </div>
  );
};

export default Loading;
