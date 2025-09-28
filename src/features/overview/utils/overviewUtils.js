// src/features/overview/utils/overviewUtils.js
export function calculateOverviewMetrics(allData) {
  if (!allData) return { totalRecords: 0, totalBLAs: 0, totalFamilies: 0, acsCovered: 0 };

  const { familySize = [], blaActivity = [], blaPerformance = [], timeline = [] } = allData;

  // Debug logging to match vanilla JS behavior
  console.log('Data lengths:', {
    familySize: familySize.length,
    blaActivity: blaActivity.length, 
    blaPerformance: blaPerformance.length,
    timeline: timeline.length
  });

  // Same calculation as vanilla JS
  const totalRecords = 
    familySize.length + blaActivity.length + blaPerformance.length + timeline.length;

  // Match vanilla JS family calculation logic
  const totalFamilies = familySize.reduce(
    (sum, record) => sum + (parseInt(record.total_families, 10) || 0),
    0
  );

  const totalBLAs = blaPerformance.length;

  // ACs covered calculation
  const acs = new Set();
  [familySize, blaActivity, blaPerformance, timeline].forEach((arr) =>
    arr.forEach((r) => r.ac_no && acs.add(r.ac_no))
  );

  console.log('Calculated metrics:', {
    totalRecords,
    totalBLAs, 
    totalFamilies,
    acsCovered: acs.size
  });

  return {
    totalRecords,
    totalBLAs,
    totalFamilies,
    acsCovered: acs.size,
  };
}
