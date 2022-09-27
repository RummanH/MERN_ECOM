import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const URL = 'https://localhost:5000';

const initialState = {
  loading: true,
  error: '',
  products: {},
};

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (param, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await axios.get(`${URL}/api/v1/products/dummy`);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue('wrong');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},

  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.loading = true;
    },

    [getAllProducts.fulfilled]: (state, action) => {
      const {
        data: { products },
      } = action.payload;

      state.loading = false;
      state.error = '';
      state.products = { ...state.products, ..._.mapKeys(products, '_id') };
    },

    [getAllProducts.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default productsSlice.reducer;
