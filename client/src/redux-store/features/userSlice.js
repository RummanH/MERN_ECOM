import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
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

const URL = 'https://localhost:5000';

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (currentUser, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await axios.post(
        `${URL}/api/v1/users/signup`,
        currentUser
      );

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
      const { data } = await axios.post(
        `${URL}/api/v1/users/login`,
        currentUser
      );

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
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      setToLocalStorage('user', JSON.stringify(state.user));
      setToLocalStorage('token', state.token);
      state.error = '';
      toast.success('Successfully created account.');
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
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.error = '';
      setToLocalStorage('user', JSON.stringify(state.user));
      setToLocalStorage('token', state.token);
      toast.success('Successfully login.');
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
