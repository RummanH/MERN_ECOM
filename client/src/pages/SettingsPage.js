import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormRow } from '../components';
import { changePassword } from '../redux-store/features/userSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValue] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
  });
  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        })
      ).unwrap();
      setValue({ currentPassword: '', password: '', passwordConfirm: '' });
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h1 className="my-3">Settings</h1>
      <form onSubmit={handleSubmit}>
        <FormRow
          controlId="currentPassword"
          labelText="Current Password"
          type="password"
          name="currentPassword"
          handleChange={handleChange}
          value={values.currentPassword}
        />

        <FormRow
          controlId="password"
          labelText="Password"
          type="password"
          name="password"
          handleChange={handleChange}
          value={values.password}
        />

        <FormRow
          controlId="passwordConfirm"
          labelText="Confirm Password"
          type="password"
          name="passwordConfirm"
          handleChange={handleChange}
          value={values.passwordConfirm}
        />

        <div className="mb-3">
          <Button type="submit" style={{ width: '100%', fontSize: '1.5rem' }}>
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
