import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { toast } from 'react-toastify';

import { request } from '../../services/axios_request';
import { getError } from '../../services/getError';

const productsAdapter = createEntityAdapter({
  selectId: (e) => e._id,
});

const initialState = productsAdapter.getInitialState({
  loading: false,
  error: '',
});

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (currentProduct, thunkAPI) => {
    try {
      const { data } = await request.post(`/products`, currentProduct, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      return data.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (seller, thunkAPI) => {
    //thunkAPI for getting other features values dispatch actions from other features and rejectWithValue
    try {
      const { data } = await request.get(
        `/products?seller=${seller ? seller : ''}`,
        {
          headers: {
            authorization: `Bearer ${thunkAPI.getState().user.token}`,
          },
        }
      );
      return data.data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getOneProductBySlug = createAsyncThunk(
  'products/getOneProduct',
  async (slug, thunkAPI) => {
    try {
      const { data } = await request.get(`/products/slug/${slug}`);
      return data.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const getOneProductById = createAsyncThunk(
  'products/getOneProductById',
  async (_id, thunkAPI) => {
    try {
      const { data } = await request.get(`/products/${_id}`);
      return data.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(getError(err));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ _id, currentProduct }, thunkAPI) => {
    try {
      const { data } = await request.patch(`/products/${_id}`, currentProduct, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
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
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.error = '';
        state.loading = false;
        productsAdapter.addOne(state, action.payload);
        toast.success('Successfully created product!');
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload);
      })

      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        productsAdapter.upsertMany(state, action.payload);
      })

      .addCase(getAllProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getOneProductBySlug.pending, (state) => {
        state.loading = true;
      })

      .addCase(getOneProductBySlug.fulfilled, (state, action) => {
        state.error = '';
        state.loading = false;
        productsAdapter.addOne(state, action.payload);
      })

      .addCase(getOneProductBySlug.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getOneProductById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getOneProductById.fulfilled, (state, action) => {
        state.error = '';
        state.loading = false;
        productsAdapter.addOne(state, action.payload);
      })

      .addCase(getOneProductById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.error = '';
        state.loading = false;
        productsAdapter.upsertOne(state, action.payload);
        toast.success('Successfully created product!');
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload);
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = '';
        state.loading = false;
        productsAdapter.removeOne(state, action.payload);
        toast.success('Product Deleted!');
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload);
      });
  },
});

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductsIds,
} = productsAdapter.getSelectors((state) => state.products);

export const selectProductsBySeller = createSelector(
  [selectAllProducts, (state, sellerId) => sellerId],
  (products, sellerId) =>
    products.filter((product) => {
      return product.seller._id === sellerId;
    })
);

export const selectProductBySlug = createSelector(
  [selectAllProducts, (state, slug) => slug],
  (products, slug) =>
    products.find((product) => {
      return product.slug === slug;
    })
);

export default productsSlice.reducer;
