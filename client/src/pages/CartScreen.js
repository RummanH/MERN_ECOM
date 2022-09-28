import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MessageBox } from '../components';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

//Bootstrap Components
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/esm/Button';
import ListGroup from 'react-bootstrap/esm/ListGroup';

import {
  addItem,
  decrease,
  removeItem,
} from '../redux-store/features/cartSlice';

const CartScreen = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const handleIncrease = async (item, quantity) => {
    const { data } = await axios.get(
      `https://localhost:5000/api/v1/products/${item._id}`
    );
    if (data.data.product.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch(addItem({ ...item, quantity }));
  };

  const handleDecrease = (id, quantity) => {
    if (quantity === 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(decrease(id));
    }
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() => handleDecrease(item._id, item.quantity)}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        // disabled={item.quantity === item.countInStock}
                        onClick={() => handleIncrease(item, item.quantity + 1)}
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>{' '}
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed to checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
