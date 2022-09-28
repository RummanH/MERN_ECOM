import { configureStore } from '@reduxjs/toolkit';

//slices
import productsReducer from './features/productsSlice';
import cartReducer from './features/cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

export { store };
