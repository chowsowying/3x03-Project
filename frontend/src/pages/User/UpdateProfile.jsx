import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  
    return (
      <Container fluid>
        <Row>
          <Col lg={12} className="p-4 overflow-auto container-height">
            <h1 className="mb-4">Update Profile</h1>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default UpdateProfile;