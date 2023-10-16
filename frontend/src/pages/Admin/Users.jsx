import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
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
        <Col lg={12} className="bg-custom p-4 overflow-auto admin-container-height ">
          <div class="card shadow border-0 mb-7 p-3">
            <div class="card-header">
              <h5 class="mb-0">All Users</h5>
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-nowrap">
                <thead class="thead-light">
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
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Users;
