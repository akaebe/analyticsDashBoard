// src/store/slices/blaPerformanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  metrics: {
    totalBLAs: 0,
    avgFamiliesPerBLA: 0,
    avgDuration: 0,
    topPerformer: null,
  },
  performanceDistribution: {
    labels: [],
    familyCounts: [],
    avgDurations: [],
  },
  efficiencyData: [],
  topPerformers: [],
  isLoading: false,
  error: null,
};

const blaPerformanceSlice = createSlice({
  name: 'blaPerformance',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setPerformanceDistribution: (state, action) => {
      state.performanceDistribution = action.payload;
    },
    setEfficiencyData: (state, action) => {
      state.efficiencyData = action.payload;
    },
    setTopPerformers: (state, action) => {
      state.topPerformers = action.payload;
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
  setMetrics,
  setPerformanceDistribution,
  setEfficiencyData,
  setTopPerformers,
  setLoading,
  setError,
} = blaPerformanceSlice.actions;

export default blaPerformanceSlice.reducer;
