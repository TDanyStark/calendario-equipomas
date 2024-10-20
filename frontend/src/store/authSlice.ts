// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  JWT: string | null;
}

const initialState: AuthState = {
  JWT: localStorage.getItem('JWT'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ JWT: string }>) => {
      state.JWT = action.payload.JWT;
      localStorage.setItem('JWT', action.payload.JWT);
    },
    logout: (state) => {
      state.JWT = null;
      localStorage.removeItem('JWT');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
