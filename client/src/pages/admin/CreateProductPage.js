import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import { createProduct } from '../../redux-store/features/productsSlice';
import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';
import { FormRow } from '../../components';

const CreateProductPage = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await request.post(
        '/products',
        { name, price, image, category, countInStock, brand, description },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(createProduct(data.data.product));
      toast.success('Product created!');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(getError(err));
    }
  };

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
    <div className="container small-container">
      <Helmet>
        <title>Create product</title>
      </Helmet>
      <h1>Create a product</h1>
      <Form onSubmit={handleCreate}>
        <FormRow
          controlId="name"
          labelText="Name"
          type="text"
          name="name"
          handleChange={(e) => setName(e.target.value)}
          value={name}
        />

        <FormRow
          controlId="price"
          labelText="Price"
          type="number"
          name="price"
          handleChange={(e) => setPrice(e.target.value)}
          value={price}
        />

        <FormRow
          controlId="image"
          labelText="Image"
          type="text"
          name="image"
          handleChange={(e) => setImage(e.target.value)}
          value={image}
        />

        <label style={{ marginBottom: '7px' }}>Select a category</label>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
          style={{ marginBottom: '13px', opacity: '.9' }}
        >
          <option selected>select</option>
          {categories.map((c) => {
            return <option value={c._id}>{c.name}</option>;
          })}
        </select>

        <FormRow
          controlId="countInStock"
          labelText="Count In Stock"
          type="number"
          name="countInStock"
          handleChange={(e) => setCountInStock(e.target.value)}
          value={countInStock}
        />

        <FormRow
          controlId="brand"
          labelText="Brand"
          type="text"
          name="brand"
          handleChange={(e) => setBrand(e.target.value)}
          value={brand}
        />

        <FormRow
          controlId="description"
          labelText="Description"
          type="text"
          name="description"
          handleChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default CreateProductPage;