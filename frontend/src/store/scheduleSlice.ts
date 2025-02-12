// src/store/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AcademicPeriodType, ScheduleDayType, ScheduleStateType } from '../types/Api';

const initialState: ScheduleStateType = {
  scheduleDays: null,
  recurrence: null,
  academicPeriod: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<{ scheduleDays: ScheduleDayType[]; recurrence: number, academicPeriod:AcademicPeriodType }>) => {
      state.scheduleDays = action.payload.scheduleDays;
      state.recurrence = action.payload.recurrence;
      state.academicPeriod = action.payload.academicPeriod;
    }
  },
});

export const { setSchedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
