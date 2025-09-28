// src/store/slices/timelineSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  trendData: {
    labels: [],
    values: [],
  },
  durationBySize: {
    labels: [],
    avgDurations: [],
    counts: [],
  },
  workPattern: {
    labels: [],
    values: [],
  },
  statistics: {
    peakHour: 'N/A',
    fastestFamily: 'N/A',
    avgDuration: 'N/A',
    totalHours: 'N/A',
  },
  controls: {
    metric: 'families',
    grouping: 'daily',
  },
  isLoading: false,
  error: null,
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setTrendData: (state, action) => {
      state.trendData = action.payload;
    },
    setDurationBySize: (state, action) => {
      state.durationBySize = action.payload;
    },
    setWorkPattern: (state, action) => {
      state.workPattern = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
    setControls: (state, action) => {
      state.controls = { ...state.controls, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setData,
  setTrendData,
  setDurationBySize,
  setWorkPattern,
  setStatistics,
  setControls,
  setLoading,
  setError,
} = timelineSlice.actions;

export default timelineSlice.reducer;
