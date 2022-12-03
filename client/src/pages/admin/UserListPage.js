import { deleteUser, getAllUsers } from '../../redux-store/features/userSlice';
import { LoadingBox, MessageBox } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { request } from '../../services/axios_request';
import { toast } from 'react-toastify';
import { getError } from '../../services/getError';

const UserListPage = () => {
  const { users, loading, error, token } = useSelector((state) => state.user);
  const allUsers = Object.values(users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await request.delete(`/users/${_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        dispatch(deleteUser(_id));
        toast.success('User deleted');
      } catch (err) {
        toast.error(getError(err));
      }
    }
    return;
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        allUsers && (
          <div>
            <Helmet>
              <title>Admin user list</title>
            </Helmet>
            <h1>User List</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>IS SELLER</th>
                  <th>IS ADMIN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td>{u._id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.roles.includes('seller') ? 'YES' : 'NO'}</td>
                      <td>{u.roles.includes('admin') ? 'YES' : 'NO'}</td>

                      <td>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => {
                            navigate(`/admin/user/${u._id}/edit`);
                          }}
                          style={{ marginRight: '10px' }}
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="light"
                          onClick={() => handleDelete(u._id)}
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

export default UserListPage;
