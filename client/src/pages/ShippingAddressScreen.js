import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

//Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { saveShippingAddress } from '../redux-store/features/cartSlice';
import { CheckoutSteps, FormRow } from '../components';

const ShippingAddressScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const { shippingAddress } = useSelector((state) => state.cart);
  const [values, setValues] = useState({
    fullName: shippingAddress.fullName || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city,
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || '',
  });
  const { fullName, address, city, postalCode, country } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
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
          <FormRow
            controlId="fullName"
            labelText="Full Name"
            handleChange={handleChange}
            name="fullName"
            value={fullName}
          />

          <FormRow
            controlId="address "
            labelText="Address"
            handleChange={handleChange}
            name="address"
            value={address}
          />

          <FormRow
            controlId="city"
            labelText="City"
            handleChange={handleChange}
            name="city"
            value={city}
          />

          <FormRow
            controlId="postalCode"
            labelText="Postal Code"
            handleChange={handleChange}
            name="postalCode"
            value={postalCode}
          />

          <FormRow
            controlId="country"
            labelText="Country"
            handleChange={handleChange}
            name="country"
            value={country}
          />

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
