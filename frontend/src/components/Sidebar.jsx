import React from "react";
import {
  HomeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    key: "dashboard",
    icon: <HomeOutlined />,
    children: undefined,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
    type: undefined,
  },
  {
    key: "products",
    icon: <AppstoreAddOutlined />,
    children: undefined,
    label: <Link to="/admin/products">Products</Link>,
    type: undefined,
  },
  {
    key: "orders",
    icon: <UnorderedListOutlined />,
    children: undefined,
    label: <Link to="/admin/orders">Orders</Link>,
    type: undefined,
  },
  {
    key: "users",
    icon: <UserOutlined />,
    children: undefined,
    label: <Link to="/admin/users">Users</Link>,
    type: undefined,
  },
];

const Sidebar = () => {
  const location = useLocation();

  // Parse the current pathname to get the selected key
  const selectedKey = location.pathname.split("/")[2] || "dashboard";

  return (
    <Menu
      defaultSelectedKeys={[selectedKey]}
      mode="inline"
      theme="dark"
      items={items}
      className="container-height"
    />
  );
};

export default Sidebar;
