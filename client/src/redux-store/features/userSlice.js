import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';
import {
  removeToLocalStorage,
  setToLocalStorage,
} from '../../services/localStorage_brower';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
  loading: false,
  error: '',
  users: {},
};

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (currentUser, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.post(`/users/signup`, currentUser);

      const { token } = data;
      const { user } = data.data;
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (currentUser, thunkAPI) => {
    try {
      const { data } = await request.post(`/users/login`, currentUser);

      const { token } = data;
      const { user } = data.data;
      return { token, user };
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const updateMe = createAsyncThunk(
  'user/updateMe',
  async (currentUpdate, thunkAPI) => {
    console.log(currentUpdate);
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.patch(`/users/updateMe`, currentUpdate, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });

      const { user } = data.data;
      return { user };
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/updatePassword',
  async (currentUpdate, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.patch(
        `/users/changePassword`,
        currentUpdate,
        {
          headers: {
            authorization: `Bearer ${thunkAPI.getState().user.token}`,
          },
        }
      );

      const { token } = data;
      return { token };
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'products/getAllUsers',
  async (param, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.get(`/users?sort=name`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      return data.data.users;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getOneUser = createAsyncThunk(
  'products/getOneUser',
  async (_id, thunkAPI) => {
    try {
      const { data } = await request.get(`/users/${_id}`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      return data.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, { payload }) => {
      state.users = {
        ...state.users,
        [payload._id]: payload,
      };
    },

    deleteUser: (state, { payload }) => {
      state.users = _.omit(state.users, payload);
    },
    signoutUser: (state) => {
      state.user = null;
      state.token = null;
      removeToLocalStorage('user');
      removeToLocalStorage('token');
    },
  },
  extraReducers: {
    [getAllUsers.pending]: (state) => {
      state.loading = true;
    },

    [getAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.users = {
        ...state.users,
        ..._.mapKeys(action.payload, '_id'),
      };
    },

    [getAllUsers.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [getOneUser.pending]: (state) => {
      state.loading = true;
    },

    [getOneUser.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.users = {
        ...state.users,
        [action.payload._id]: action.payload,
      };
    },

    [getOneUser.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [signupUser.pending]: (state) => {
      state.loading = true;
    },

    [signupUser.fulfilled]: (state, { payload }) => {
      toast.success('Successfully created account.');
      state.loading = false;
      state.error = '';
      state.user = payload.user;
      state.token = payload.token;
      setToLocalStorage('user', JSON.stringify(state.user));
      setToLocalStorage('token', state.token);
    },

    [signupUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      toast.error(payload);
    },

    [loginUser.pending]: (state) => {
      state.loading = true;
    },

    [loginUser.fulfilled]: (state, { payload }) => {
      toast.success('Successfully login.');
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.error = '';
      setToLocalStorage('user', JSON.stringify(state.user));
      setToLocalStorage('token', state.token);
    },

    [loginUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      toast.error(payload);
    },

    [updateMe.pending]: (state) => {
      state.loading = true;
    },

    [updateMe.fulfilled]: (state, { payload }) => {
      toast.success('Profile updated successfully.');
      state.loading = false;
      state.user = payload.user;
      state.error = '';
      setToLocalStorage('user', JSON.stringify(state.user));
    },

    [updateMe.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      toast.error(payload);
    },

    [changePassword.pending]: (state) => {
      state.loading = true;
    },

    [changePassword.fulfilled]: (state, { payload }) => {
      toast.success('Password updated successfully.');
      state.loading = false;
      state.token = payload.token;
      state.error = '';
      setToLocalStorage('token', state.token);
    },

    [changePassword.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      toast.error(payload);
    },
  },
});

export const { signoutUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
