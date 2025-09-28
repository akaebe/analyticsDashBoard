// src/features/blaPerformance/BLAPerformanceTab.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart } from '../../components/charts/BarChart';
import { ScatterChart } from "../../components/charts/ScatterChart";
import { formatUtils, dataUtils } from "../../utils";

export const BLAPerformanceTab = () => {
  const { data } = useSelector((state) => state.dashboard);
  const blaPerformanceData = data.blaPerformance || [];

  const metrics = useMemo(() => {
    if (!blaPerformanceData.length) {
      return {
        totalBLAs: 0,
        avgFamiliesPerBLA: 0,
        avgDuration: 0,
        topPerformer: "N/A",
      };
    }

    const totalBLAs = blaPerformanceData.length;
    const avgFamiliesPerBLA = dataUtils.avgBy(
      blaPerformanceData,
      "total_families_created"
    );
    const avgDuration = dataUtils.avgBy(
      blaPerformanceData,
      "avg_duration_minutes"
    );
    const topPerformerData = dataUtils.sortBy(
      blaPerformanceData,
      "total_families_created",
      "desc"
    )[0];
    const topPerformer = topPerformerData ? topPerformerData.bla_name : "N/A";

    return { totalBLAs, avgFamiliesPerBLA, avgDuration, topPerformer };
  }, [blaPerformanceData]);

  const performanceDistributionData = useMemo(() => {
    if (!blaPerformanceData.length) {
      return { labels: [], datasets: [] };
    }

    const ranges = [
      { label: "1-50", min: 1, max: 50 },
      { label: "51-100", min: 51, max: 100 },
      { label: "101-200", min: 101, max: 200 },
      { label: "201-300", min: 201, max: 300 },
      { label: "301+", min: 301, max: Infinity },
    ];

    const distribution = ranges.map((range) => {
      const blasInRange = blaPerformanceData.filter(
        (bla) =>
          bla.total_families_created >= range.min &&
          bla.total_families_created <= range.max
      );
      return {
        label: range.label,
        count: blasInRange.length,
        avgDuration:
          blasInRange.length > 0
            ? dataUtils.avgBy(blasInRange, "avg_duration_minutes")
            : 0,
      };
    });

    return {
      labels: distribution.map((d) => d.label),
      datasets: [
        {
          label: "Number of BLAs",
          data: distribution.map((d) => d.count),
          backgroundColor: "rgba(37, 99, 235, 0.7)",
          borderColor: "#2563eb",
          borderWidth: 2,
          yAxisID: "y",
        },
        {
          label: "Avg Duration (minutes)",
          data: distribution.map((d) => d.avgDuration),
          type: "line",
          backgroundColor: "rgba(245, 158, 11, 0.3)",
          borderColor: "#f59e0b",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          yAxisID: "y1",
        },
      ],
    };
  }, [blaPerformanceData]);

  // NEW: Efficiency Analysis Scatter Chart Data
  const efficiencyChartData = useMemo(() => {
    if (!blaPerformanceData.length) {
      return { datasets: [] };
    }

    // Sample data for performance (take top 1000 to avoid overcrowding)
    const sampleData = [...blaPerformanceData]
      .sort((a, b) => b.total_families_created - a.total_families_created)
      .slice(0, 1000);

    const scatterPoints = sampleData.map((bla) => ({
      x: bla.total_families_created,
      y: bla.avg_duration_minutes,
      bla_name: bla.bla_name,
      verified: bla.total_verified_members,
    }));

    return {
      datasets: [
        {
          label: "BLA Performance",
          data: scatterPoints,
          backgroundColor: "rgba(16, 185, 129, 0.6)",
          borderColor: "#10b981",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [blaPerformanceData]);

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Total BLAs</h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatUtils.formatExactNumber(metrics.totalBLAs)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Avg Families/BLA
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.avgFamiliesPerBLA.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Avg Duration
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatUtils.formatDuration(metrics.avgDuration)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Top Performer
          </h4>
          <p className="text-lg font-bold text-gray-900 truncate">
            {metrics.topPerformer}
          </p>
        </div>
      </div>

      {/* Charts Grid - Now includes both charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Performance Distribution
          </h3>
          <div className="h-96">
            <BarChart
              data={performanceDistributionData}
              title="BLAs by Family Creation Range"
              formatTooltip={(value) => formatUtils.formatExactNumber(value)}
            />
          </div>
        </div>

        {/* NEW: Efficiency Analysis Scatter Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ⚡ Efficiency Analysis (Families vs Avg Duration)
          </h3>
          <div className="h-96">
            <ScatterChart
              data={efficiencyChartData}
              formatTooltip={(value, label) => {
                if (label === "x")
                  return `Families Created: ${formatUtils.formatExactNumber(
                    value
                  )}`;
                if (label === "y")
                  return `Avg Duration: ${formatUtils.formatDuration(value)}`;
                return formatUtils.formatExactNumber(value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold p-6 border-b border-gray-200">
          🏆 Top 20 Performers
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">BLA Name</th>
                <th className="p-4 text-left">Families Created</th>
                <th className="p-4 text-left">Avg Duration</th>
                <th className="p-4 text-left">Verified Members</th>
              </tr>
            </thead>
            <tbody>
              {dataUtils
                .sortBy(blaPerformanceData, "total_families_created", "desc")
                .slice(0, 20)
                .map((bla, index) => (
                  <tr key={bla.bla_id} className="border-b last:border-b-0">
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          index < 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{bla.bla_name}</td>
                    <td className="p-4">
                      {formatUtils.formatExactNumber(
                        bla.total_families_created
                      )}
                    </td>
                    <td className="p-4">
                      {formatUtils.formatDuration(bla.avg_duration_minutes)}
                    </td>
                    <td className="p-4">
                      {formatUtils.formatExactNumber(
                        bla.total_verified_members
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
