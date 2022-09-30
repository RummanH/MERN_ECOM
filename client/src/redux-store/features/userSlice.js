import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getError } from '../../services/getError';

const initialState = { user: '', token: null, loading: false };

const URL = 'https://localhost:5000';

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (currentUser, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await axios.get(`${URL}/api/v1/signup`, currentUser);
      const { user } = data.data;
      const token = { data };
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [signupUser.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default userSlice.reducer;
