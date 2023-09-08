import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

const Header = () => {
  // Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));

  // Function: Logout user
  const handleLogout = () => {
    // Logout user from firebase
    firebase.auth().signOut();
    // Update redux state
    dispatch({ type: "LOGOUT", payload: null });
    // Redirect
    navigate("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Ecommerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">{!user && <Nav.Link href="/login">Login</Nav.Link>}</Nav>
          {user && user.role === "admin" && (
            <Nav>
              <NavDropdown
                title={user.email && user.email.split("@")[0]}
                id="collasible-nav-dropdown">
                <NavDropdown.Item href="/admin/dashboard">Admin Dashboard</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
          {user && user.role === "user" && (
            <Nav>
              <Nav.Link href="/cart">Cart</Nav.Link>
              <NavDropdown
                title={user.email && user.email.split("@")[0]}
                id="collasible-nav-dropdown">
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
