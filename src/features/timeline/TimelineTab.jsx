// src/features/timeline/TimelineTab.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LineChart } from "../../components/charts/LineChart";
import { BarChart } from "../../components/charts/BarChart";
import { formatUtils, dataUtils } from "../../utils";

export const TimelineTab = () => {
  const { data } = useSelector((state) => state.dashboard);
  const timelineData = data.timeline || [];

  // Timeline control filters - matches vanilla JS setupEventListeners
  const [filters, setFilters] = useState({
    metric: "families", // families, family-size, duration
    grouping: "daily", // hourly, daily, ac
  });

  // Helper function to get metric labels
  const getMetricLabel = (metric) => {
    switch (metric) {
      case "families":
        return "Families Created";
      case "family-size":
        return "Average Family Size";
      case "duration":
        return "Average Duration";
      default:
        return "Families Created";
    }
  };
  // Update Timeline handler - matches vanilla JS updateTimelineChart
  const handleUpdateTimeline = () => {
    console.log("Updating timeline with filters:", filters);
    // The charts will automatically update via useMemo dependencies
  };

  // Timeline Trend Chart Data - with complete filtering support
  const timelineTrendData = useMemo(() => {
    if (!timelineData.length) {
      return { labels: [], datasets: [] };
    }

    let groupedData;
    let labels;
    let values;
    let yAxisLabel;
    let chartTitle;

    // Group data based on selected grouping
    switch (filters.grouping) {
      case "hourly":
        groupedData = dataUtils.groupBy(
          timelineData.filter(
            (d) => d.start_hour !== null && d.start_hour !== undefined
          ),
          "start_hour"
        );
        const hours = Array.from({ length: 24 }, (_, i) => i);
        labels = hours.map((h) => `${h.toString().padStart(2, "0")}:00`);

        values = hours.map((hour) => {
          const hourData = groupedData[hour] || [];
          switch (filters.metric) {
            case "families":
              return hourData.length;
            case "family-size":
              return hourData.length > 0
                ? dataUtils.avgBy(hourData, "family_size")
                : 0;
            case "duration":
              return hourData.length > 0
                ? dataUtils.avgBy(hourData, "creation_duration_minutes")
                : 0;
            default:
              return hourData.length;
          }
        });

        chartTitle = `Hourly ${getMetricLabel(filters.metric)}`;
        break;

      case "ac":
        groupedData = dataUtils.groupBy(timelineData, "ac_no");
        const sortedACs = Object.keys(groupedData).sort();
        labels = sortedACs.map((ac) => `AC ${ac}`);

        values = sortedACs.map((ac) => {
          const acData = groupedData[ac];
          switch (filters.metric) {
            case "families":
              return acData.length;
            case "family-size":
              return dataUtils.avgBy(acData, "family_size");
            case "duration":
              return dataUtils.avgBy(acData, "creation_duration_minutes");
            default:
              return acData.length;
          }
        });

        chartTitle = `AC-wise ${getMetricLabel(filters.metric)}`;
        break;

      case "daily":
      default:
        groupedData = dataUtils.groupBy(timelineData, "date");
        const sortedDates = Object.keys(groupedData).sort();
        labels = sortedDates.map((date) =>
          new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

        values = sortedDates.map((date) => {
          const dayData = groupedData[date];
          switch (filters.metric) {
            case "families":
              return dayData.length;
            case "family-size":
              return dataUtils.avgBy(dayData, "family_size");
            case "duration":
              return dataUtils.avgBy(dayData, "creation_duration_minutes");
            default:
              return dayData.length;
          }
        });

        chartTitle = `Daily ${getMetricLabel(filters.metric)}`;
        break;
    }

    // Set y-axis label and colors based on metric
    const getChartConfig = (metric) => {
      switch (metric) {
        case "families":
          return {
            yAxisLabel: "Number of Families",
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
          };
        case "family-size":
          return {
            yAxisLabel: "Average Family Size",
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
          };
        case "duration":
          return {
            yAxisLabel: "Average Duration (minutes)",
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
          };
        default:
          return {
            yAxisLabel: "Count",
            borderColor: "#6b7280",
            backgroundColor: "rgba(107, 114, 128, 0.1)",
          };
      }
    };

    const config = getChartConfig(filters.metric);

    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(filters.metric),
          data: values,
          borderColor: config.borderColor,
          backgroundColor: config.backgroundColor,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: config.borderColor,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
      yAxisLabel: config.yAxisLabel,
      chartTitle,
    };
  }, [timelineData, filters]);

  // Duration by Size Chart Data - existing implementation
  const durationBySizeData = useMemo(() => {
    if (!timelineData.length) {
      return { labels: [], datasets: [] };
    }

    const sizeGroups = dataUtils.groupBy(timelineData, "family_size");
    const sizes = Object.keys(sizeGroups)
      .map((size) => parseInt(size))
      .filter((size) => !isNaN(size) && size > 0)
      .sort((a, b) => a - b)
      .slice(0, 10);

    const labels = sizes.map((size) => `${size} member${size > 1 ? "s" : ""}`);

    const avgDurations = sizes.map((size) => {
      const validRecords = sizeGroups[size].filter(
        (r) => r.creation_duration_minutes >= 0
      );
      return validRecords.length > 0
        ? dataUtils.avgBy(validRecords, "creation_duration_minutes")
        : 0;
    });

    const counts = sizes.map((size) => sizeGroups[size].length);

    return {
      labels,
      datasets: [
        {
          label: "Average Duration",
          data: avgDurations,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "#10b981",
          borderWidth: 2,
          yAxisID: "y",
        },
        {
          label: "Family Count",
          data: counts,
          type: "line",
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.3)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          yAxisID: "y1",
        },
      ],
    };
  }, [timelineData]);

  // Work Pattern Chart Data - existing implementation
  const workPatternData = useMemo(() => {
    if (!timelineData.length) {
      return { labels: [], datasets: [] };
    }

    const hourlyGroups = dataUtils.groupBy(
      timelineData.filter(
        (d) => d.start_hour !== null && d.start_hour !== undefined
      ),
      "start_hour"
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const labels = hours.map((h) => h.toString().padStart(2, "0"));
    const values = hours.map((hour) =>
      hourlyGroups[hour] ? hourlyGroups[hour].length : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Families Created",
          data: values,
          backgroundColor: values.map((value, index) => {
            const hour = parseInt(labels[index]);
            if (hour >= 9 && hour <= 17) {
              return "rgba(16, 185, 129, 0.8)"; // Work hours - green
            } else if (hour >= 18 && hour <= 21) {
              return "rgba(245, 158, 11, 0.8)"; // Evening - orange
            } else {
              return "rgba(107, 114, 128, 0.8)"; // Other hours - gray
            }
          }),
          borderColor: "#374151",
          borderWidth: 1,
        },
      ],
    };
  }, [timelineData]);

  // Statistics calculation - existing implementation
  const statistics = useMemo(() => {
    if (!timelineData.length) {
      return {
        peakHour: "N/A",
        fastestFamily: "N/A",
        avgDuration: "N/A",
        totalHours: "N/A",
      };
    }

    // Find peak hour
    const hourlyGroups = dataUtils.groupBy(
      timelineData.filter((d) => d.start_hour !== null),
      "start_hour"
    );

    const peakHourData = Object.entries(hourlyGroups).sort(
      ([, a], [, b]) => b.length - a.length
    )[0];

    const peakHour = peakHourData
      ? `${peakHourData[0]}:00 (${peakHourData[1].length} families)`
      : "N/A";

    // Find fastest family creation
    const validDurations = timelineData.filter(
      (d) =>
        d.creation_duration_minutes >= 0 && d.creation_duration_minutes < 1000
    );

    const fastestDuration =
      validDurations.length > 0
        ? Math.min(...validDurations.map((d) => d.creation_duration_minutes))
        : 0;
    const fastestFamily = formatUtils.formatDuration(fastestDuration);

    // Calculate average duration
    const avgDurationMinutes =
      validDurations.length > 0
        ? dataUtils.avgBy(validDurations, "creation_duration_minutes")
        : 0;
    const avgDuration = formatUtils.formatDuration(avgDurationMinutes);

    // Calculate total hours worked
    const totalMinutes = dataUtils.sumBy(
      validDurations,
      "creation_duration_minutes"
    );
    const totalHours = formatUtils.formatDuration(totalMinutes);

    return {
      peakHour,
      fastestFamily,
      avgDuration,
      totalHours,
    };
  }, [timelineData]);

  return (
    <div className="space-y-8">
      {/* Timeline Controls Panel - Complete filtering functionality */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Metric:</label>
            <select
              id="timeline-metric"
              value={filters.metric}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, metric: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="families">Family Count</option>
              <option value="family-size">Family Size</option>
              <option value="duration">Average Duration</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Group By:</label>
            <select
              id="timeline-grouping"
              value={filters.grouping}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, grouping: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hourly">Hour</option>
              <option value="daily">Day</option>
              <option value="ac">AC (Assembly Constituency)</option>
            </select>
          </div>

          <button
            id="update-timeline"
            onClick={handleUpdateTimeline}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Timeline
          </button>
        </div>
      </div>

      {/* Timeline Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm py-20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📈 {timelineTrendData.chartTitle || "Family Creation Timeline"}
        </h3>
        <div className="h-80">
          <LineChart
            data={timelineTrendData}
            formatTooltip={(value) => {
              if (filters.metric === "duration") {
                return formatUtils.formatDuration(value);
              } else if (filters.metric === "family-size") {
                return value.toFixed(1);
              } else {
                return formatUtils.formatExactNumber(value);
              }
            }}
          />
        </div>
      </div>

      {/* Duration and Pattern Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm py-20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ⏱️ Creation Duration by Family Size
          </h3>
          <div className="h-80">
            <BarChart
              data={durationBySizeData}
              formatTooltip={(value) => formatUtils.formatDuration(value)}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm py-20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🕐 Work Pattern: Families Created by Hour
          </h3>
          <div className="h-80">
            <BarChart
              data={workPatternData}
              formatTooltip={(value) => formatUtils.formatExactNumber(value)}
            />
          </div>
        </div>
      </div>

      {/* Timeline Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          ⏱️ Timeline Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg border-b-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Peak Hour</p>
            <p id="peak-hour" className="text-xl font-bold text-gray-900">
              {statistics.peakHour}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border-b-4 border-green-500">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Fastest Family
            </p>
            <p id="fastest-family" className="text-xl font-bold text-gray-900">
              {statistics.fastestFamily}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border-b-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Avg Duration
            </p>
            <p
              id="avg-duration-timeline"
              className="text-xl font-bold text-gray-900"
            >
              {statistics.avgDuration}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border-b-4 border-orange-500">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Hours Worked
            </p>
            <p id="total-hours" className="text-xl font-bold text-gray-900">
              {statistics.totalHours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
