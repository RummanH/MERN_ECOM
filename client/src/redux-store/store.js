import { configureStore } from '@reduxjs/toolkit';

//slices
import productsReducer from './features/productsSlice';
import cartReducer from './features/cartSlice';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export { store };
