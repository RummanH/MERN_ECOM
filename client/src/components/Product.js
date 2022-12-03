import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { addItem, increase } from '../redux-store/features/cartSlice';
import { request } from '../services/axios_request';
import Rating from './Rating';
import Row from 'react-bootstrap/esm/Row';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    const existItem = cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity : 0;
    const { data } = await request.get(`/products/${product._id}`);

    //can use any value if not 1
    if (data.data.product.countInStock < quantity + 1) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    if (existItem) {
      dispatch(increase({ ...product, quantity: 1 }));
    } else {
      dispatch(addItem({ ...product, quantity: 1 }));
    }
    setAdding(false);
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={product.image} alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </Link>

        <Row>
          <Card.Text>${product.price}</Card.Text>
          <div className="row">
            <Link to={`/seller/${product.seller._id}`}>
              {product.seller.name}
            </Link>
          </div>
        </Row>

        {product.countInStock === 0 ? (
          <Button variant="light">Out of stock</Button>
        ) : (
          <Button variant="primary" onClick={handleAddToCart} disabled={adding}>
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
