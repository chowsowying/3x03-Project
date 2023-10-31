import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetAllUserOrders, changeStatus } from "../../api/adminAPI";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { BiSolidHide } from "react-icons/bi";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [orderDetails, setOrderDetails] = useState({});

  const fetchUserOrders = async () => {
    try {
      const response = await GetAllUserOrders(user.token);
      setOrders(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then((res) => {
        toast.success("Status updated successfully");
        fetchUserOrders();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="bg-custom p-4 overflow-auto admin-container-height">
          <div className="card shadow border-0 mb-7 p-3">
            <div className="card-header">
              <h5 className="mb-0">All Orders</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Ordered On</th>
                    <th>Order By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr>
                        <td>{order._id}</td>
                        <td>${(order.paymentIntent.amount / 100).toFixed(2)}</td>
                        <td>{new Date(order.paymentIntent.created * 1000).toLocaleString()}</td>
                        <td>{order.orderedBy.name}</td>
                        <td>
                          <select
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="form-select"
                            defaultValue={order.orderStatus}>
                            <option value="Not Processed">Not Processed</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              setOrderDetails((prevDetails) => ({
                                ...prevDetails,
                                [order._id]: !prevDetails[order._id],
                              }))
                            }>
                            {orderDetails[order._id] ? <BiSolidHide /> : <PiMagnifyingGlassBold />}
                          </button>
                        </td>
                      </tr>
                      {orderDetails[order._id] && (
                        <tr>
                          <td colSpan="6">
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
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrders;
