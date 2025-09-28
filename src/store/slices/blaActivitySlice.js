// src/store/slices/blaActivitySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  filteredData: [],
  filters: {
    startDate: '2025-07-01',
    endDate: '2025-07-13',
  },
  charts: {
    dailyActivity: null,
    hourlyPattern: null,
    topBLAs: null,
  },
  heatmapData: null,
  isLoading: false,
  error: null,
};

const blaActivitySlice = createSlice({
  name: 'blaActivity',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      state.filteredData = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setHeatmapData: (state, action) => {
      state.heatmapData = action.payload;
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
  setFilteredData,
  setFilters,
  setHeatmapData,
  setLoading,
  setError,
} = blaActivitySlice.actions;

export default blaActivitySlice.reducer;
