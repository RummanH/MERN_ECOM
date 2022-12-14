import React, { useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoadingBox, MessageBox } from '../../components';
import {
  deleteOrder,
  getAllOrders,
} from '../../redux-store/features/orderSlice';

const OrderListPage = (props) => {
  const sellerMode = window.location.href.includes('/seller');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);

  let allOrders;
  if (sellerMode) {
    allOrders = Object.values(orders).filter((o) => {
      return o.seller === user._id;
    });
  } else {
    allOrders = Object.values(orders);
  }

  const handleDelete = async (_id) => {
    try {
      await dispatch(deleteOrder(_id)).unwrap();
    } catch (err) {}
    return;
  };

  useEffect(() => {
    dispatch(getAllOrders(sellerMode ? user._id : ''));
  }, [dispatch, user, sellerMode]);
  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        allOrders && (
          <div>
            <Helmet>
              <title>Admin order list</title>
            </Helmet>
            <h1>Order list</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>DELIVERED</th>
                  <th>PAID</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => {
                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user ? order.user.name : ''}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
                          : 'No'}
                      </td>
                      <td>
                        {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => {
                            navigate(`/order/${order._id}`);
                          }}
                          style={{ marginRight: '10px' }}
                        >
                          Actions
                        </Button>

                        <Button
                          type="button"
                          variant="light"
                          onClick={() => handleDelete(order._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default OrderListPage;
