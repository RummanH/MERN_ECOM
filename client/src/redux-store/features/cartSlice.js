import { createSlice } from '@reduxjs/toolkit';

import {
  removeToLocalStorage,
  setToLocalStorage,
} from '../../services/localStorage_brower';

const initialState = {
  cartItems: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [],
  totalPrice: 0,
  numberOfProducts: 0,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod') || '',
  error: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      //here payload is whole item with quantity
      state.error = '';
      state.cartItems.push(payload);
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },

    increase: (state, { payload }) => {
      //here payload is whole item with quantity
      const cartItem = state.cartItems.find((item) => item._id === payload._id);
      cartItem.quantity = cartItem.quantity + payload.quantity;
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },

    decrease: (state, { payload }) => {
      //here payload is only id
      const cartItem = state.cartItems.find((item) => item._id === payload);
      cartItem.quantity = cartItem.quantity - 1;
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },

    removeItem: (state, { payload }) => {
      //here payload is only id
      state.cartItems = state.cartItems.filter((item) => item._id !== payload);
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      removeToLocalStorage('cart');
    },

    calculateTotal: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.quantity;
        total += item.quantity * item.price;
      });
      state.numberOfProducts = amount;
      state.totalPrice = total;
    },

    saveShippingAddress: (state, { payload }) => {
      state.shippingAddress = payload;
      setToLocalStorage(
        'shippingAddress',
        JSON.stringify(state.shippingAddress)
      );
    },

    clearShippingAddress: (state) => {
      state.shippingAddress = {};
      removeToLocalStorage('shippingAddress');
    },

    savePaymentMethod: (state, { payload }) => {
      state.paymentMethod = payload;
      setToLocalStorage('paymentMethod', payload);
    },

    clearPaymentMethod: (state) => {
      state.paymentMethod = '';
      removeToLocalStorage('paymentMethod');
    },
  },
});

export const {
  addItem,
  removeItem,
  decrease,
  increase,
  clearCart,
  calculateTotal,
  saveShippingAddress,
  clearShippingAddress,
  savePaymentMethod,
  clearPaymentMethod,
} = cartSlice.actions;
export default cartSlice.reducer;
