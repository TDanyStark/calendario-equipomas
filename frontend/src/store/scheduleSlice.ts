// src/store/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleDayType, ScheduleState } from '../types/Api';

const initialState: ScheduleState = {
  scheduleDays: null,
  recurrence: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<{ scheduleDays: ScheduleDayType[]; recurrence: string }>) => {
      state.scheduleDays = action.payload.scheduleDays;
      state.recurrence = action.payload.recurrence;
    }
  },
});

export const { setSchedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
