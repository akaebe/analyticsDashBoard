// src/components/charts/ScatterChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { formatUtils } from "../../utils";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export const ScatterChart = ({ data, title, height = 400, formatTooltip }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          title: (context) => {
            const point = context[0].raw;
            return point.bla_name || "BLA";
          },
          label: (context) => {
            const point = context.raw;
            return [
              `Families Created: ${formatUtils.formatExactNumber(point.x)}`,
              `Avg Duration: ${formatUtils.formatDuration(point.y)}`,
              `Verified Memb ers: ${formatUtils.formatExactNumber(
                point.verified || 0
              )}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: (value) => formatUtils.formatNumber(value),
        },
        title: {
          display: true,
          text: "Total Families Created",
          color: "#6b7280",
        },
        beginAtZero: true,
      },
      y: {
        type: "linear",
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: (value) => formatUtils.formatDuration(value),
        },
        title: {
          display: true,
          text: "Average Duration per Family",
          color: "#6b7280",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Scatter data={data} options={options} />
    </div>
  );
};
