import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

//Bootstrap
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import { signupUser } from '../redux-store/features/userSlice';
import { FormRow } from '../components';

const initialValue = { name: '', email: '', password: '', passwordConfirm: '' };

const SignUpPage = () => {
  const [values, setValue] = useState(initialValue);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //How to get params value
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const { user } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.passwordConfirm) {
      toast.error('Passwords are not the same!');
      return;
    }
    dispatch(signupUser(values));
  };

  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      navigate(redirect || '/');
    }
  }, [user, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Signup</title>
      </Helmet>
      <h1 className="my-3">Signup</h1>
      <Form onSubmit={handleSubmit}>
        <FormRow
          name="name"
          labelText="Name"
          type="text"
          handleChange={handleChange}
          value={values.name}
        />

        <FormRow
          name="email"
          labelText="Email"
          type="email"
          handleChange={handleChange}
          value={values.email}
        />

        <FormRow
          name="password"
          labelText="Password"
          type="password"
          handleChange={handleChange}
          value={values.password}
        />

        <FormRow
          name="passwordConfirm"
          labelText="Confirm Password"
          type="password"
          handleChange={handleChange}
          value={values.passwordConfirm}
        />
        <div className="mb-3">
          <Button type="submit" style={{ width: '100%', fontSize: '1.5rem' }}>
            Signup
          </Button>
        </div>

        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignUpPage;
