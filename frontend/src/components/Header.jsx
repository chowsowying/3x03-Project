import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";

const Header = () => {
  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const handleLogout = () => {
    //clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //clear redux
    dispatch(setUser(null));
    //redirect
    navigate("/login");
  };
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-white px-4 border-bottom">
      <Container fluid>
        <Navbar.Brand href="/">Ecommerce XX</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {!user && (
            <Nav className="ms-auto">
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          )}
          {user && user.role === "admin" && (
            <>
              <Nav.Link href="/admin/dashboard" className="pe-4">
                Overview
              </Nav.Link>
              <Nav.Link href="/admin/users" className="pe-4">
                Users
              </Nav.Link>
              <Nav.Link href="/admin/orders" className="pe-4">
                Orders
              </Nav.Link>
              <Nav.Link href="/admin/products" className="pe-4">
                Products
              </Nav.Link>
              <Nav className="ms-auto">
                <NavDropdown title={user.name && user.name} id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          )}
          {user && user.role === "user" && (
            <Nav className="ms-auto">
              <Nav.Link href="/cart">Cart</Nav.Link>
              <NavDropdown title={user.name && user.name} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/user/dashboard">User Dashboard</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
