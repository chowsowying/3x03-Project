import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetUserOrders } from "../../api/allUserOrdersAPI";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.user);

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
          <h1>User Orders</h1>
          {orders.map((order) => (
            <div key={order._id}>
              <h4>Order ID: {order._id}</h4>
              <p>Order Status: {order.orderStatus}</p>
              <p>Payment Status: {order.paymentIntent.status}</p>
              <p>Ordered Products:</p>
              <ul>
                {order.products.map((product) => (
                  <li key={order._id + "-" + product.product._id}>
                    Product ID: {product.product._id} | Product Name: {product.product.title} | Quantity: {product.count}
                  </li>
                ))}
              </ul>
              <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
              <hr />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrders;