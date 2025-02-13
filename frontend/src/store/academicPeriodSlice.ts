// src/store/periodSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Period {
  year: number;
  semester: number;
}


const initialState = {
  period: null as Period | null,
};


const periodSlice = createSlice({
  name: 'period',
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<Period>) => {
      state.period = action.payload;
      localStorage.setItem('period', JSON.stringify(action.payload));
    },
    clearPeriod: (state) => {
      state.period = null;
      localStorage.removeItem('period');
    },
  },
});

export const { setPeriod, clearPeriod } = periodSlice.actions;

export default periodSlice.reducer;
