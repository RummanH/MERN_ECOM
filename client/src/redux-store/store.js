import { configureStore } from '@reduxjs/toolkit';

//slices
import productsReducer from './features/productsSlice';
import orderReducer from './features/orderSlice';
import cartReducer from './features/cartSlice';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: orderReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export { store };
