import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormRow, LoadingBox, MessageBox } from '../../components';
import { getOneUser, updateUser } from '../../redux-store/features/userSlice';
import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';

const UserEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { _id } = params;
  const { users, loading, error } = useSelector((state) => state.user);
  const user = Object.values(users).find((u) => u._id === _id);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSeller, setIsSeller] = useState('');
  const [isAdmin, setIsAdmin] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch(getOneUser(_id));
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.roles.includes('admin') ? true : false);
      setIsSeller(user.roles.includes('seller') ? true : false);
    }
  }, [_id, dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await request.patch(
        `/users/${_id}`,
        {
          name,
          email,
          isAdmin,
          isSeller,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      console.log(data.data);
      dispatch(updateUser(data.data.user));
      navigate('/admin/userlist');
      toast.success('User updated!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Edit user</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        user && (
          <div>
            <form onSubmit={handleSubmit}>
              <FormRow
                controlId="name"
                labelText="Name"
                type="name"
                name="name"
                handleChange={(e) => setName(e.target.value)}
                value={name}
              />

              <FormRow
                controlId="email"
                labelText="Email"
                type="email"
                name="email"
                handleChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <div>
                <label htmlFor="isAdmin" style={{ marginRight: '10px' }}>
                  Is Admin
                </label>
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </div>

              <div>
                <label htmlFor="isSeller" style={{ marginRight: '10px' }}>
                  Is Seller
                </label>
                <input
                  id="isSeller"
                  type="checkbox"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                />
              </div>
              <Button type="submit">Update</Button>
            </form>
          </div>
        )
      )}
    </div>
  );
};

export default UserEditPage;
