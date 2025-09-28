// src/features/overview/OverviewTab.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { MetricsRow } from './components/MetricsRow';
import { ChartsRow } from './components/ChartsRow';
import { SummaryTable } from './components/SummaryTable';
import { calculateOverviewMetrics } from './utils/overviewUtils';

export const OverviewTab = () => {
  const { data } = useSelector((state) => state.dashboard);
  const metrics = calculateOverviewMetrics(data);

  return (
    <div className="space-y-8">
      <MetricsRow metrics={metrics} />
      <ChartsRow data={data} />
      <SummaryTable data={data} />
    </div>
  );
};
