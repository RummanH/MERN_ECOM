import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FormRow from '../../components/FormRow';
import {
  getOneProductById,
  updateProduct,
  selectProductById,
} from '../../redux-store/features/productsSlice';
import { request } from '../../services/axios_request';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { getError } from '../../services/getError';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { _id } = params;
  const product = useSelector((state) => selectProductById(state, _id));

  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [image, setImage] = useState(product ? product.image : '');
  const [category, setCategory] = useState(product ? product.category : '');
  const [countInStock, setCountInStock] = useState(
    product ? product.countInStock : ''
  );
  const [brand, setBrand] = useState(product ? product.brand : '');
  const [description, setDescription] = useState(
    product ? product.description : ''
  );
  const [categories, setCategories] = useState([]);

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
    const fetchProduct = async () => {
      try {
        const p = await dispatch(getOneProductById(_id)).unwrap();
        setName(p.name);
        setPrice(p.price);
        setImage(p.image);
        setCategory(p.category._id);
        setCountInStock(p.countInStock);
        setBrand(p.brand);
        setDescription(p.description);
      } catch (error) {}
    };

    if (!product) {
      fetchProduct();
    }
  }, [_id, dispatch, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        updateProduct({
          _id,
          currentProduct: {
            name,
            price,
            image,
            category,
            countInStock,
            brand,
            description,
          },
        })
      );
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="small-container container">
      <div>
        <h3>Edit Product {_id}</h3>
      </div>
      {product && (
        <Form onSubmit={handleSubmit}>
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
            <option defaultValue="select">select</option>
            {categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
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
      )}
    </div>
  );
};

export default ProductEditPage;
