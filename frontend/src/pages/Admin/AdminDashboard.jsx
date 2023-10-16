import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { GetUserCount, GetOrderCount, GetProductCount } from "../../api/userAPI";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { HiUsers } from "react-icons/hi";
import { GoListUnordered } from "react-icons/go";
import { MdProductionQuantityLimits } from "react-icons/md";

const AdminDashboard = () => {
  //State
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  // Vraiables
  const { user } = useSelector((state) => state.user);

  //Fucntion: Handle Fetch User Count
  const fetchUserCount = async () => {
    try {
      const response = await GetUserCount(user.token);
      setUsersCount(response.data.userCount);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Fucntion: Handle Fetch Orders Count
  const fetchOrdersCount = async () => {
    try {
      const response = await GetOrderCount(user.token);
      setOrdersCount(response.data.orderCount);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Fucntion: Handle Fetch Products Count
  const fetchProductsCount = async () => {
    try {
      const response = await GetProductCount(user.token);
      setProductsCount(response.data.productCount);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchOrdersCount();
    fetchProductsCount();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="p-4 bg-custom overflow-auto admin-container-height">
          <h2>Admin Dashboard</h2>
          <Row className="pt-2">
            <Col md={4}>
              <div className="card bg-danger text-white">
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">{usersCount}</h4>
                    <p className="card-text">Number of users</p>
                  </div>
                  {/* Icon added on the right */}
                  <HiUsers size={50} />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="card bg-primary text-white">
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">{ordersCount}</h4>
                    <p className="card-text">Number of Orders</p>
                  </div>
                  {/* Icon added on the right */}
                  <GoListUnordered size={50} />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="card bg-success text-white">
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">{productsCount}</h4>
                    <p className="card-text">Number of Product</p>
                  </div>
                  {/* Icon added on the right */}
                  <MdProductionQuantityLimits size={50} />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="pt-4 overflow-auto">
              <div class="card shadow border-0 mb-7 p-3">
                <div class="card-header">
                  <h5 class="mb-0">Enquires</h5>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-nowrap">
                    <thead class="thead-light">
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Message</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
