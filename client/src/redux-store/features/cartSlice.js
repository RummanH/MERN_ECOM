import { createSlice } from '@reduxjs/toolkit';

//own
import { setToLocalStorage } from '../../services/setToLocalStorage';

const initialState = {
  cartItems: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [],
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
  },
});

export const { addItem, removeItem, decrease, increase } = cartSlice.actions;
export default cartSlice.reducer;
