// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './slices/dashboardSlice';
import familySizeSlice from './slices/familSizeSlice'; 
import blaActivitySlice from './slices/blaActivitySlice';
import blaPerformanceSlice from './slices/blaPerformanceSlice';
import timelineSlice from './slices/timelineSlice';

// src/store/index.js
export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    familySize: familySizeSlice,
    blaActivity: blaActivitySlice,
    blaPerformance: blaPerformanceSlice,
    timeline: timelineSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Ignore these paths in the state
        ignoredPaths: [
          'dashboard.data.timeline.first_member_time',
          'dashboard.data.timeline.last_member_time'
        ],
      },
      // Increase thresholds for large datasets
      immutableCheck: {
        warnAfter: 128,
      },
    }),
});


export default store;
