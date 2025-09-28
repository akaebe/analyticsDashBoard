// src/store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dataLoaderService } from '../../services/dataLoader';

const initialState = {
  currentTab: 'overview',
  isLoading: false,
  error: null,
  data: {
    familySize: [],
    blaActivity: [],
    blaPerformance: [],
    timeline: [],
  },
};

export const loadAllData = createAsyncThunk(
  'dashboard/loadAllData',
  async () => {
    const [familySize, blaActivity, blaPerformance, timeline] = await Promise.all([
      dataLoaderService.loadFamilySizeData(),
      dataLoaderService.loadBLAActivityData(),
      dataLoaderService.loadBLAPerformanceData(),
      dataLoaderService.loadTimelineData(),
    ]);

    return {
      familySize,
      blaActivity,
      blaPerformance,
      timeline,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loadAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  },
});

export const { setCurrentTab, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
