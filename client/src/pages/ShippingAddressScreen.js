import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addShippingAddress } from '../redux-store/features/cartSlice';
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components';

const ShippingAddressScreen = () => {
  const { user } = useSelector((state) => state.user);
  const { shippingAddress } = useSelector((state) => state.cart);
  const [values, setValues] = useState({
    fullName: shippingAddress.fullName || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city,
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fullName, address, city, postalCode, country } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addShippingAddress({ fullName, address, city, postalCode, country })
    );

    navigate('/payment');
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=/shipping');
    }
  }, [user, navigate]);

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={handleChange}
              required
              name="fullName"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={handleChange}
              required
              name="address"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={handleChange}
              required
              name="city"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={handleChange}
              required
              name="postalCode"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={handleChange}
              required
              name="country"
            />
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShippingAddressScreen;
