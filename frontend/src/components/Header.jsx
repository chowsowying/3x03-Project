import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { addToCart } from "../redux/cartSlice";
import { FaUser } from "react-icons/fa";

const Header = () => {
  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const handleLogout = () => {
    //clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    //clear redux
    dispatch(setUser(null));
    dispatch(addToCart([]));
    //redirect
    navigate("/login");
  };
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-white px-3 border-bottom">
      <Container fluid>
        <Navbar.Brand
          href={user && user.role === "admin" ? "/admin/dashboard" : "/"}
          className="fw-bold">
          ThirdLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {!user && (
            <Nav className="ms-auto">
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          )}
          {user && user.role === "admin" && (
            <>
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
                {/* <NavDropdown title={user.name && user.name} id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown> */}
                <Nav.Link className="d-flex align-items-center gap-2">
                  <FaUser /> {user.name && user.name}
                </Nav.Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </Nav>
            </>
          )}
          {user && user.role === "user" && (
            <>
              <Nav.Link href="/user/my-orders" className="pe-4">
                My Orders
              </Nav.Link>
              <Nav.Link href="/user/profile" className="pe-4">
                My Profile
              </Nav.Link>
              <Nav className="ms-auto">
                <Nav.Link href="/cart">
                  Cart
                  <span className=" ms-2 badge rounded-pill bg-danger">
                    {cart.length && cart.length}
                  </span>
                </Nav.Link>

                <Nav.Link className="d-flex align-items-center gap-2">
                  <FaUser /> {user.name && user.name}
                </Nav.Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
