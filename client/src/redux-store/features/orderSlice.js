import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';

const initialState = {
  loading: false,
  error: '',
  orders: {},
};

export const getAllOrders = createAsyncThunk(
  'products/getAllOrders',
  async (param, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.get(`/orders`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      return data.data.orders;
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

export const deleteOrder = createAsyncThunk(
  'products/deleteOrder',
  async (_id, thunkAPI) => {
    try {
      await request.delete(`/orders/${_id}`, {
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

const ordersSlice = createSlice({
  name: 'orders',
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
    [getAllOrders.pending]: (state) => {
      state.loading = true;
    },

    [getAllOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.orders = {
        ...state.orders,
        ..._.mapKeys(action.payload, '_id'),
      };
    },

    [getAllOrders.rejected]: (state, action) => {
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

    [deleteOrder.pending]: (state) => {
      state.loading = true;
    },

    [deleteOrder.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.orders = _.omit(state.orders, action.payload);
      toast.success('Order Deleted!');
    },

    [deleteOrder.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.error(action.payload);
    },
  },
});

export const { createProduct, getOneProductById, updateProduct } =
  ordersSlice.actions;

export default ordersSlice.reducer;
