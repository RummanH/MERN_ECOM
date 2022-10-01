import { createSlice } from '@reduxjs/toolkit';

import {
  removeToLocalStorage,
  setToLocalStorage,
} from '../../services/localStorage_browser';

const initialState = {
  cartItems: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [],
  totalPrice: 0,
  numberOfProducts: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      //here payload is whole item with quantity
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
  },
});

export const {
  addItem,
  removeItem,
  decrease,
  increase,
  clearCart,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
