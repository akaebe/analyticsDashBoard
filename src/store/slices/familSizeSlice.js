// src/store/slices/familySizeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  filteredData: [],
  filters: {
    ac: 'all',
    sizeCategory: 'all',
  },
  statistics: {
    totalFamilies: 0,
    avgFamilySize: 0,
    smallFamilies: 0,
    largeFamilies: 0,
  },
  isLoading: false,
  error: null,
};

const familySizeSlice = createSlice({
  name: 'familySize',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      state.filteredData = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
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
  setFilters,
  setFilteredData,
  setStatistics,
  setLoading,
  setError,
} = familySizeSlice.actions;

export default familySizeSlice.reducer;
