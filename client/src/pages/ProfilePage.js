import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FormRow } from '../components';
import { updateMe } from '../redux-store/features/userSlice';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValue] = useState({
    name: user.name,
    email: user.email,
    sellerName: user.seller ? user.seller.name : '',
    sellerLogo: user.seller ? user.seller.logo : '',
    description: user.seller ? user.seller.description : '',
  });
  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        updateMe({
          name: values.name,
          email: values.email,
          seller: {
            name: values.sellerName,
            logo: values.sellerLogo,
            description: values.description,
          },
        })
      ).unwrap();
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={handleSubmit}>
        <FormRow
          controlId="name"
          labelText="Name"
          type="name"
          name="name"
          handleChange={handleChange}
          value={values.name}
        />

        <FormRow
          controlId="email"
          labelText="Email"
          type="email"
          name="email"
          handleChange={handleChange}
          value={values.email}
        />

        {user.roles.includes('seller') && (
          <>
            <h2>Seller</h2>
            <FormRow
              controlId="sellerName"
              labelText="Seller Name"
              type="text"
              name="sellerName"
              handleChange={handleChange}
              value={values.sellerName}
            />

            <FormRow
              controlId="sellerLogo"
              labelText="Seller Logo"
              type="text"
              name="sellerLogo"
              handleChange={handleChange}
              value={values.sellerLogo}
            />

            <FormRow
              controlId="sellerDescription"
              labelText="Seller Description"
              type="text"
              name="description"
              handleChange={handleChange}
              value={values.description}
            />
          </>
        )}

        <div className="mb-3">
          <Button type="submit" style={{ width: '100%', fontSize: '1.5rem' }}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
