import { createSlice } from '@reduxjs/toolkit';
import { setToLocalStorage } from '../../services/setToLocalStorage';

const initialState = {
  cartItems: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [],
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      const existItem = state.cartItems.find(
        (item) => item._id === payload._id
      );
      if (existItem) {
        existItem.quantity = payload.quantity;
        setToLocalStorage('cart', JSON.stringify(state.cartItems));
      } else {
        state.cartItems.push(payload);
        setToLocalStorage('cart', JSON.stringify(state.cartItems));
      }
    },

    removeItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== payload);
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },

    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload);
      cartItem.quantity = cartItem.quantity - 1;
      setToLocalStorage('cart', JSON.stringify(state.cartItems));
    },
  },
});

export const { addItem, removeItem, decrease } = cartSlice.actions;
export default cartSlice.reducer;
