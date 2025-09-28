// src/features/overview/components/SummaryTable.jsx
import React, { useMemo } from 'react';
import { formatUtils } from '../../../utils/formatUtils';
export const SummaryTable = ({ data }) => {
  const rows = useMemo(() => buildSummaryRows(data), [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold p-6 border-b border-gray-200">
        📋 Data Summary
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Analysis Type</th>
              <th className="p-4 text-left">Record Count</th>
              <th className="p-4 text-left">Coverage</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.type} className="border-b last:border-b-0">
                <td className="p-4">{r.type}</td>
                <td className="p-4">{formatUtils.formatExactNumber(r.count)}</td>
                <td className="p-4">{r.coverage}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------- helpers ---------- */

function buildSummaryRows(raw) {
  // Calculate actual coverage data based on your vanilla JS logic
  const acsCovered = calculateACsCovered(raw);
  const dateRange = calculateDateRange(raw);
  const blasCount = formatBLAsCount(raw?.blaPerformance?.length || 0);
  const timelineRecords = formatRecordsCount(raw?.timeline?.length || 0);

  return [
    {
      type: 'Family Size Analysis',
      count: raw?.familySize?.length || 0,
      coverage: `${acsCovered} ACs`, // ← Fixed: Actual AC coverage
      status: 'Complete',
    },
    {
      type: 'BLA Daily Activity',
      count: raw?.blaActivity?.length || 0,
      coverage: dateRange, // ← Fixed: Actual date range
      status: 'Complete',
    },
    {
      type: 'BLA Performance',
      count: raw?.blaPerformance?.length || 0,
      coverage: blasCount, // ← Fixed: Actual BLA count
      status: 'Complete',
    },
    {
      type: 'Timeline Analysis',
      count: raw?.timeline?.length || 0,
      coverage: timelineRecords, // ← Fixed: Actual timeline records
      status: 'Complete',
    },
  ];
}

// Helper functions to calculate coverage data
function calculateACsCovered(data) {
  const acs = new Set();
  
  // Collect ACs from all datasets
  [data?.familySize, data?.blaActivity, data?.blaPerformance, data?.timeline]
    .filter(Boolean)
    .forEach((dataset) => {
      dataset.forEach((record) => {
        if (record.ac_no) {
          acs.add(record.ac_no);
        }
      });
    });
  
  return `${acs.size}/234`; // Total ACs as per your vanilla JS
}

function calculateDateRange(data) {
  if (!data?.blaActivity?.length) return 'No data';
  
  const dates = data.blaActivity
    .map(record => record.date)
    .filter(Boolean)
    .sort();
  
  if (dates.length === 0) return 'No dates';
  
  const uniqueDates = [...new Set(dates)];
  return `${uniqueDates.length} Days`;
}

function formatBLAsCount(count) {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+ BLAs`;
  }
  return `${count} BLAs`;
}

function formatRecordsCount(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+ Records`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+ Records`;
  }
  return `${count} Records`;
}
