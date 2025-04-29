import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // we will create this file next

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
