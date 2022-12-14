import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Bootstrap
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';

import {
  ShippingAddressPage,
  PaymentMethodPage,
  OrderHistoryPage,
  ProductEditPage,
  ProductListPage,
  PlaceOrderPage,
  DashboardPage,
  SettingsPage,
  ProfilePage,
  ProductPage,
  SignInPage,
  SearchPage,
  SignUpPage,
  OrderPage,
  HomePage,
  CartPage,
  CreateProductPage,
  OrderListPage,
  UserListPage,
  UserEditPage,
} from './pages/index';
import { signoutUser } from './redux-store/features/userSlice';

import {
  clearCart,
  clearPaymentMethod,
  clearShippingAddress,
} from './redux-store/features/cartSlice';

import { request } from './services/axios_request';
import { AdminRoute, ProtectedRoute, SearchBox } from './components';
import SellerRoute from './components/SellerRoute';
import AdminAndSeller from './components/AdminAndSeller';
import SellerPage from './pages/SellerPage';
import Prefetch from './components/Prefetch';

function App() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const handleSignout = () => {
    dispatch(signoutUser());
    dispatch(clearCart());
    dispatch(clearShippingAddress());
    dispatch(clearPaymentMethod());
    window.location.href = '/signin';
  };

  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await request(`/categories`);
        setCategories(data.data.categories);
      } catch (err) {}
    };
    fetchCategory();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sideBarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSideBarIsOpen(!sideBarIsOpen)}
              >
                <i className="fas fa-bars" style={{ fontSize: '1.6rem' }}></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>Rumman's</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
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
                      <LinkContainer to="/setting">
                        <NavDropdown.Item>Settings</NavDropdown.Item>
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
                  {user && user.roles.includes('seller') && (
                    <NavDropdown title="Seller" id="seller-nav-dropdown">
                      <LinkContainer to="/seller/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/seller/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {user && user.roles.includes('admin') && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <div
          className={
            sideBarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category, i) => (
              <Nav.Item key={i}>
                <LinkContainer
                  to={`/search?category=${category._id}`}
                  onClick={() => setSideBarIsOpen(false)}
                >
                  <Nav.Link>{category.name}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shipping" element={<ShippingAddressPage />} />
              <Route path="/payment" element={<PaymentMethodPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/setting" element={<SettingsPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route element={<Prefetch />}>
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/orderhistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/order/:id/:completed" element={<OrderPage />} />
                <Route path="/seller/:sellerId" element={<SellerPage />} />

                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <DashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/product/:_id/edit"
                  element={
                    <AdminAndSeller>
                      <ProductEditPage />
                    </AdminAndSeller>
                  }
                />
                <Route
                  path="/admin/userlist"
                  element={
                    <AdminRoute>
                      <UserListPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/user/:_id/edit"
                  element={
                    <AdminAndSeller>
                      <UserEditPage />
                    </AdminAndSeller>
                  }
                />
                <Route
                  path="/admin/productlist"
                  element={
                    <AdminRoute>
                      <ProductListPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/createproduct"
                  element={
                    <AdminAndSeller>
                      <CreateProductPage />
                    </AdminAndSeller>
                  }
                />

                <Route
                  path="/admin/orderlist"
                  element={
                    <AdminRoute>
                      <OrderListPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/seller/productlist"
                  element={
                    <SellerRoute>
                      <ProductListPage />
                    </SellerRoute>
                  }
                />

                <Route
                  path="/seller/orderlist"
                  element={
                    <SellerRoute>
                      <OrderListPage />
                    </SellerRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
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
