import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';
import { FormRow, LoadingBox, MessageBox } from '../../components';
import { useCreateProductMutation } from '../../redux-store/features/productSlice';
import { useSelector } from 'react-redux';

const CreateProductPage = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const [
    createProduct,
    {
      isLoading: createProductIsLoading,
      isSuccess: createProductIsSuccess,
      isError: createProductIsError,
      error: createProductError,
    },
  ] = useCreateProductMutation();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFromData = new FormData();
    bodyFromData.append('image', file);
    try {
      setLoadingUpload(true);
      const { data } = await request.post('/uploads', bodyFromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      });
      setLoadingUpload(false);
      setImage(data.data.image);
    } catch (err) {
      setErrorUpload(getError(err));
      setLoadingUpload(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        price,
        image,
        category,
        countInStock,
        brand,
        description,
      }).unwrap();
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

  useEffect(() => {
    if (createProductIsSuccess) {
      setName('');
      setPrice(0);
      setImage('');
      setCategory('');
      setCountInStock(0);
      setBrand('');
      setDescription('');
    }
  }, [createProductIsSuccess, navigate]);

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

        <div>
          <FormRow
            controlId="image"
            labelText="Image"
            type="text"
            name="image"
            value={image}
          />

          <label htmlFor="imageFile">Image File</label>
          <Form.Control
            type="file"
            id="imageFile"
            label="Choose Image"
            onChange={uploadFileHandler}
            style={{
              opacity: '.9',
              padding: '5px',
              fontSize: '1.5rem',
            }}
          />
          {loadingUpload && <LoadingBox />}
          {errorUpload && (
            <MessageBox variant="danger">{errorUpload}</MessageBox>
          )}
        </div>

        <label style={{ marginBottom: '7px', marginTop: '15px' }}>
          Select a category
        </label>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
          style={{
            marginBottom: '13px',
            opacity: '.9',
            padding: '5px',
            fontSize: '1.5rem',
          }}
        >
          <option defaultValue="select">select</option>
          {categories.map((c) => {
            return (
              <option value={c._id} key={c._id}>
                {c.name}
              </option>
            );
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
        {createProductIsLoading ? (
          <LoadingBox />
        ) : (
          <Button
            variant="primary"
            type="submit"
            style={{ width: '100%', fontSize: '1.5rem' }}
          >
            Create Product
          </Button>
        )}
      </Form>
    </div>
  );
};

export default CreateProductPage;
