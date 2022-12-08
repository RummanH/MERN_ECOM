import React, { useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingBox, MessageBox, Product, Rating } from '../components';
import { request } from '../services/axios_request';
import { getError } from '../services/getError';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        results: action.payload.results,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1star & up',
    rating: 1,
  },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('search') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'all';
  const page = sp.get('page') || 1;

  const [categories, setCategories] = useState([]);
  const categoryTxt = categories
    ? categories.find((ct) => ct._id === category)
    : '';

  const [{ loading, error, products, pages, results }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      products: [],
      results: 0,
    }
  );

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
    const minPrice = price !== 'all' ? price.split('-')[0] : null;
    const maxPrice = price !== 'all' ? price.split('-')[1] : null;
    const searchQuery = query !== 'all' ? `search=${query}` : '';
    const searchCategory = category !== 'all' ? `&category=${category}` : '';
    const searchPrice =
      price !== 'all' ? `&price[gte]=${minPrice}&price[lte]=${maxPrice}` : '';
    const searchRating = rating !== 'all' ? `&rating[gte]=${rating}` : '';
    let searchOrder = '&sort=-CreatedAt';
    if (order === 'highest') searchOrder = '&sort=-price';
    if (order === 'lowest') searchOrder = '&sort=price';
    if (order === 'toprated') searchOrder = '&sort=-rating';

    const finalSearch = `${searchQuery}${searchCategory}${searchPrice}${searchRating}${searchOrder}`;
    const fetchData = async () => {
      try {
        const { data } = await request.get(`/products?${finalSearch}`);

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { products: data.data.products, results: data.results },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [page, query, category, price, rating, order]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&search=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Row>
        <Col md={3}>
          <div>
            <h3>Category</h3>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>

              {categories.map((c) => (
                <li key={c._id}>
                  <Link
                    className={c._id === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c._id })}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>

              {prices.map((p, i) => (
                <li key={i}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r, i) => (
                <li key={i}>
                  <Link
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'} rating={0} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {results === 0 ? 'No' : results} Results
                    {query !== 'all' && ' Search : ' + query}
                    {category !== 'all' && ' Category : ' + categoryTxt.name}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button variant="light" onClick={() => navigate('/')}>
                        <i className="fas fa-times-circle" />
                      </Button>
                    ) : null}
                  </div>
                </Col>

                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrival</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: Hight to Low</option>
                    <option value="toprated">Avg. Customer Review</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product productId={product._id} />
                  </Col>
                ))}
              </Row>
              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
