// src/features/overview/components/ChartsRow.jsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { formatUtils } from '../../../utils/formatUtils';
ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export const ChartsRow = ({ data }) => {
  const { coverageChart, dailyTrendChart } = useMemo(() => buildDatasets(data), [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AC-coverage doughnut */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🗺️ Data Coverage by AC
        </h3>
        <div className="h-72">
          <Doughnut data={coverageChart.data} options={coverageChart.options} />
        </div>
      </div>

      {/* Daily phone-number trend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📈 Daily Activity Trend
        </h3>
        <div className="h-72">
          <Line data={dailyTrendChart.data} options={dailyTrendChart.options} />
        </div>
      </div>
    </div>
  );
};

/* ---------- helpers ---------- */

const TOTAL_ACS = 234; // <-- change if your dataset covers a different max

function buildDatasets(raw) {
  const blaActivity = raw?.blaActivity ?? [];

  /* Coverage doughnut */
  const coveredACs = new Set(blaActivity.map((r) => r.ac_no));
  const coverageChart = {
    data: {
      labels: ['ACs with Data', 'Missing ACs'],
      datasets: [
        {
          data: [coveredACs.size, TOTAL_ACS - coveredACs.size],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#0f766e', '#b91c1c'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
    },
  };

  /* Daily trend line */
  const groups = {};
  blaActivity.forEach((r) => {
    groups[r.date] = (groups[r.date] || 0) + (r.unique_phone_numbers_added || 0);
  });

  const sortedDates = Object.keys(groups).sort();
  const dailyTrendChart = {
    data: {
      labels: sortedDates.map((d) =>
        new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Phone Numbers Added',
          data: sortedDates.map((d) => groups[d]),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => formatUtils.formatNumber(v) },
          title: { display: true, text: 'Phone Numbers Added' },
        },
        x: { title: { display: true, text: 'Date' } },
      },
    },
  };

  return { coverageChart, dailyTrendChart };
}
