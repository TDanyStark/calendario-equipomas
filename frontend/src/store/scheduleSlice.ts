// src/store/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleDayType, ScheduleStateType } from '../types/Api';

const initialState: ScheduleStateType = {
  scheduleDays: null,
  recurrence: null,
  activeSemester: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<{ scheduleDays: ScheduleDayType[]; recurrence: number, activeSemester:string }>) => {
      state.scheduleDays = action.payload.scheduleDays;
      state.recurrence = action.payload.recurrence;
      state.activeSemester = action.payload.activeSemester;
    }
  },
});

export const { setSchedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
