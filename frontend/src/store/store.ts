// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import scheduleReducer from './scheduleSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
  },
});

// Inferir los tipos de RootState y AppDispatch desde la tienda
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
