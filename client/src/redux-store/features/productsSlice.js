import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';

import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';

const initialState = {
  loading: false,
  error: '',
  products: {},
  successCreate: false,
};

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (param, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.get(`/products`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
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
      const { data } = await request.get(`/products/slug/${slug}`);
      return data.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (_id, thunkAPI) => {
    try {
      await request.delete(`/products/${_id}`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      return _id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getOneProductById: (state, { payload }) => {
      state.products = {
        ...state.products,
        [payload._id]: payload,
      };
    },
    createProduct: (state, { payload }) => {
      state.products = {
        ...state.products,
        [payload._id]: payload,
      };
    },
    updateProduct: (state, { payload }) => {
      state.products = {
        ...state.products,
        [payload._id]: payload,
      };
    },
  },

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

    [deleteProduct.pending]: (state) => {
      state.loading = true;
    },

    [deleteProduct.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.error = '';
      state.loading = false;
      state.products = _.omit(state.products, action.payload);
      console.log(state.products);
    },

    [getOneProduct.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { createProduct, getOneProductById, updateProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
