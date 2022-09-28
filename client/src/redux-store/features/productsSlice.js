import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getError } from '../../services/getError';
import axios from 'axios';
import _ from 'lodash';

const URL = 'https://localhost:5000';

const initialState = {
  loading: false,
  error: '',
  products: {},
};

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (param, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await axios.get(`${URL}/api/v1/products/dummy`);
      return data.data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getOneProduct = createAsyncThunk(
  'products/getOneProduct',
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axios.get(`${URL}/api/v1/products/slug/${slug}`);
      return data.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
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
      state.loading = false;
      state.error = '';
      state.products = {
        ...state.products,
        ..._.mapKeys(action.payload, '_id'),
      };
    },

    [getAllProducts.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [getOneProduct.pending]: (state) => {
      state.loading = true;
    },

    [getOneProduct.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.products = {
        ...state.products,
        [action.payload._id]: action.payload,
      };
    },

    [getOneProduct.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default productsSlice.reducer;
