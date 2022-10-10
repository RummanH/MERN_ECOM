import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signoutUser: (state) => {
      state.user = null;
      state.token = null;
      removeToLocalStorage('user');
      removeToLocalStorage('token');
    },
  },
  extraReducers: {
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
  },
});

export const { signoutUser } = userSlice.actions;

export default userSlice.reducer;
