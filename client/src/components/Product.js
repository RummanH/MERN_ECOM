import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

//Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//own
import { addItem, increase } from '../redux-store/features/cartSlice';
import Rating from './Rating';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleAddToCart = async () => {
    const existItem = cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity : 0;
    const { data } = await axios.get(
      `https://localhost:5000/api/v1/products/${product._id}`
    );

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
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light">Out of stock</Button>
        ) : (
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
