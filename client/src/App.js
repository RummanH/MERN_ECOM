import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

//Bootstrap
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/esm/Badge';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/esm/Nav';
import NavDropdown from 'react-bootstrap/esm/NavDropdown';

import {
  ProductScreen,
  HomeScreen,
  CartScreen,
  SigninScreen,
  ShippingAddressScreen,
  SignUpScreen,
  PaymentMethodScreen,
  PlaceOrderScreen,
  OrderScreen,
  OrderHistory,
} from './pages/index';
import { signoutUser } from './redux-store/features/userSlice';

import {
  clearCart,
  clearPaymentMethod,
  clearShippingAddress,
} from './redux-store/features/cartSlice';

function App() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const handleSignout = () => {
    dispatch(signoutUser());
    dispatch(clearCart());
    dispatch(clearShippingAddress());
    dispatch(clearPaymentMethod());
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Rumman's</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>

                  {user ? (
                    <NavDropdown title={user.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={handleSignout}
                      >
                        Signout
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/order/:id/:completed" element={<OrderScreen />} />
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">All right reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
