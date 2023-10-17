import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetUserOrders } from "../../api/userAPI";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [orderDetails, setOrderDetails] = useState({});

  const fetchUserOrders = async () => {
    try {
      const response = await GetUserOrders(user.token);
      setOrders(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="bg-light p-4 overflow-auto container-height">
          <h2>My Orders</h2>
          {orders.length > 0 ? (
            <table className="table table-bordered table-striped mt-4">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Ordered On</th>
                  <th>Status</th>
                  <th>Order Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td>{order._id}</td>
                      <td>${(order.paymentIntent.amount / 100).toFixed(2)}</td>
                      <td>{new Date(order.paymentIntent.created * 1000).toLocaleString()}</td>
                      <td>{order.orderStatus}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            setOrderDetails((prevDetails) => ({
                              ...prevDetails,
                              [order._id]: !prevDetails[order._id],
                            }))
                          }>
                          {orderDetails[order._id] ? "Hide Order Details" : "Show Order Details"}
                        </button>
                      </td>
                    </tr>
                    {orderDetails[order._id] && (
                      <tr>
                        <td colSpan="5">
                          <div>
                            <table className="table table-bordered">
                              <thead className="thead-light">
                                <tr>
                                  <th>Title</th>
                                  <th>Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((product) => (
                                  <tr key={product._id}>
                                    <td>{product.product.title}</td>
                                    <td>{product.count}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <h5 className="text-danger mt-4">No orders found</h5>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrders;
