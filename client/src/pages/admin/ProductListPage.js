import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminProductTable from '../../components/AdminProductTable';
import {
  selectAllProducts,
  useGetAllProductsQuery,
} from '../../redux-store/features/productSlice';
import UserListPage from './UserListPage';

const ProductListPage = (props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  console.log(user._id);
  const { isLoading, isSuccess, isError, error, data } = useGetAllProductsQuery(
    undefined,
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let products = useSelector(selectAllProducts);

  const sellerMode = window.location.href.includes('/seller');
  if (sellerMode && products) {
    products = products.filter((product) => product.seller._id === user._id);
  }

  return (
    <div>
      <Row>
        <h1>Products</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/createproduct')}
          style={{ width: '100%', fontSize: '1.5rem' }}
        >
          Create Product
        </Button>
      </Row>

      {
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <AdminProductTable productId={product._id} key={product._id} />
              ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default ProductListPage;
