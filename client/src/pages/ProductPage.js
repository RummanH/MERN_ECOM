import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';

//Bootstrap
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {
  getOneProductBySlug,
  selectProductBySlug,
} from '../redux-store/features/productsSlice';
import { addItem, increase } from '../redux-store/features/cartSlice';
import { Rating } from '../components';
import { request } from '../services/axios_request';

const ProductPage = () => {
  const navigate = useNavigate();

  //How to get value from params
  const params = useParams();
  const { slug } = params;

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const product = useSelector((state) => selectProductBySlug(state, slug));

  useEffect(() => {
    dispatch(getOneProductBySlug(slug));
  }, [slug, dispatch]);

  const handleAddToCart = async () => {
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
    navigate('/cart');
  };

  return (
    product && (
      <div>
        <Row>
          <Col md={6}>
            <img src={product.image} className="img-large" alt={product.name} />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description : <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Seller{' '}
                    <h2>
                      <Link to={`/seller/${product.seller._id}`}>
                        {product.seller.seller.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={product.seller.seller.rating}
                      numReviews={product.seller.seller.numReviews}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button variant="primary" onClick={handleAddToCart}>
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  );
};

export default ProductPage;
