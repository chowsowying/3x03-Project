import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { GetAllUsers } from "../../api/userAPI";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../redux/loaderSlice";

const Users = () => {
  // State
  const [users, setUsers] = useState([]);

  // Declare variables
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  //Function: Fetch all users
  const fetchAllUsers = async () => {
    dispatch(setLoading(true));
    GetAllUsers(user.token)
      .then((res) => {
        console.log("users:", res.data);
        setUsers(res.data);
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        dispatch(setLoading(false));
      });
  };

  // useEffect
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={2} md={4} xs={2} className="m-0 p-0">
          <Sidebar />
        </Col>
        <Col lg={10} md={8} xs={10} className="bg-light p-4 overflow-auto container-height ">
          <h1 className="mb-4">All Users</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Users;
