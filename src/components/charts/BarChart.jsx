// src/components/charts/BarChart.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = React.forwardRef(
  (
    {
      data,
      title,
      height = 400,
      horizontal = false,
      stacked = false,
      formatTooltip,
      customTooltipCallback,
    },
    ref
  ) => {
    const chartRef = useRef(null);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      };
    }, []);

    // Update ref for parent access
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(chartRef.current);
        } else if (ref.current !== undefined) {
          ref.current = chartRef.current;
        }
      }
    }, [ref]);

    // Check if we have dual-axis data (only for non-horizontal charts)
    const hasDualAxis =
      !horizontal &&
      data.datasets &&
      data.datasets.some((dataset) => dataset.yAxisID === "y1");

    // Check if we have mixed chart types (bar + line)
    const hasMixedTypes =
      data.datasets && data.datasets.some((dataset) => dataset.type === "line");

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? "y" : "x",
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: "Inter",
            },
          },
        },
        title: {
          display: !!title,
          text: title,
          font: {
            size: 16,
            weight: "bold",
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#374151",
          borderWidth: 1,
          cornerRadius: 8,
          mode: "index",
          intersect: false,
          callbacks: {
            title:
              customTooltipCallback ||
              function (context) {
                return context[0].label;
              },
            label: (context) => {
              const value = context.parsed[horizontal ? "x" : "y"];

              // Handle BLA Activity top performers (horizontal chart)
              if (horizontal && context.datasetIndex === 0) {
                const formattedValue = formatTooltip
                  ? formatTooltip(value)
                  : value.toLocaleString();
                return `Daily Avg: ${formattedValue}`;
              }

              // Handle dual-axis charts (BLA Performance distribution)
              if (hasDualAxis && !horizontal) {
                if (context.datasetIndex === 1) {
                  const formattedValue = formatTooltip
                    ? formatTooltip(value)
                    : value.toLocaleString();
                  return `BLAs: ${formattedValue}`;
                } else if (context.datasetIndex === 1) {
                  return `Avg Duration: ${formatDuration(value)}`;
                }
              }

              // Default tooltip formatting
              const formattedValue = formatTooltip
                ? formatTooltip(value)
                : value.toLocaleString();
              return `${context.dataset.label}: ${formattedValue}`;
            },
          },
        },
      },
      scales: horizontal
        ? {
            // Horizontal chart scales (for Top BLAs)
            x: {
              grid: {
                color: "#f3f4f6",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 11 },
                callback: function (value) {
                  return formatTooltip
                    ? formatTooltip(value)
                    : value.toLocaleString();
                },
              },
              title: {
                display: true,
                text: "Daily Average",
              },
              beginAtZero: true,
            },
            y: {
              grid: {
                color: "#f3f4f6",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 10 },
              },
              title: {
                display: true,
                text: "BLA Name",
              },
            },
          }
        : {
            // Vertical chart scales
            x: {
              stacked,
              grid: {
                color: "#f3f4f6",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 11 },
              },
              title: {
                display: hasDualAxis,
                text: hasDualAxis ? "Families Created Range" : undefined,
              },
              beginAtZero: true,
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              stacked,
              grid: {
                color: "#f3f4f6",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 11 },
              },
              title: {
                display: hasDualAxis,
                text: hasDualAxis ? "Number of BLAs" : undefined,
              },
              beginAtZero: true,
            },
            // Add secondary Y-axis only for dual-axis vertical charts
            ...(hasDualAxis && {
              y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  color: "#6b7280",
                  font: { size: 11 },
                  callback: function (value) {
                    return formatDuration(value);
                  },
                },
                title: {
                  display: true,
                  text: "Avg Duration (minutes)",
                },
              },
            }),
          },
    };

    return (
      <div style={{ height }}>
        <Bar ref={chartRef} data={data} options={options} redraw={true} />
      </div>
    );
  }
);

// Helper function to format duration
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }
};

BarChart.displayName = 'BarChart';
