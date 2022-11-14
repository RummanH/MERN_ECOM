import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

//Bootstrap
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import { loginUser } from '../redux-store/features/userSlice';
import { FormRow } from '../components';

const initialValue = { email: '', password: '' };

const SignInPage = () => {
  const [values, setValue] = useState(initialValue);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Here I am getting redirect value from query
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const { user } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      toast.error('Please provide email and password!');
      return;
    }
    dispatch(loginUser(values));
  };

  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const googleButtonClick = () => {
    window.open('https://localhost:5000/auth/google');
  };

  useEffect(() => {
    if (user) {
      navigate(redirect || '/');
    }
  }, [user, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={handleSubmit}>
        <FormRow
          controlId="email"
          labelText="Email"
          type="email"
          name="email"
          handleChange={handleChange}
          value={values.email}
        />

        <FormRow
          controlId="password"
          labelText="Password"
          type="password"
          name="password"
          handleChange={handleChange}
          value={values.password}
        />

        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>

        <p className="center">Or</p>
        <button
          onClick={googleButtonClick}
          type="button"
          className="btn btn-block"
          style={{ backgroundColor: '#dd4b39', color: 'white' }}
        >
          Login with google
        </button>

        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignInPage;
