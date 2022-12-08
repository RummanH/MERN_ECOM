import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from './apiSlice';

const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState({
  loading: false,
});

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => '/products',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedProducts = responseData.data.products.map((product) => {
          product.id = product._id;
          return product;
        });
        return productsAdapter.setAll(initialState, loadedProducts);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            {
              type: 'Products',
              id: 'LIST',
            },
            ...result.ids.map((id) => ({ type: 'Products', id })),
          ];
        } else return [{ type: 'Products', id: 'LIST' }];
      },
    }),

    getOneProductById: builder.query({
      query: (_id) => `/products/${_id}`,
      providesTags: (result, error, arg) => [{ type: 'Products', id: arg }],
      transformResponse: (responseData) => {
        return responseData.data.product;
      },
    }),

    createProduct: builder.mutation({
      query: (currentProduct) => ({
        url: '/products',
        method: 'POST',
        body: currentProduct,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProduct: builder.mutation({
      query: ({ _id, currentUpdate }) => ({
        url: `/products/${_id}`,
        method: 'PATCH',
        body: currentUpdate,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Products', id: arg._id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (_id) => ({
        url: `/products/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Products', id: arg._id },
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetOneProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;

export const selectProductsResult =
  productApiSlice.endpoints.getAllProducts.select();

const selectProductsData = createSelector(
  selectProductsResult,
  (productsResult) => productsResult.data
);

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductsIds,
} = productsAdapter.getSelectors(
  (state) => selectProductsData(state) ?? initialState
);

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
