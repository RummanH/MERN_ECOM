import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

//Bootstrap
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import { signupUser } from '../redux-store/features/userSlice';
import { toast } from 'react-toastify';

const initialValue = { name: '', email: '', password: '', passwordConfirm: '' };

const SignUpScreen = () => {
  const [values, setValue] = useState(initialValue);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //here I am getting redirect value from query
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
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            required
            name="name"
            onChange={handleChange}
            value={values.name}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            name="email"
            onChange={handleChange}
            value={values.email}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            name="password"
            onChange={handleChange}
            value={values.password}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            name="passwordConfirm"
            onChange={handleChange}
            value={values.passwordConfirm}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Signup</Button>
        </div>

        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignUpScreen;
