// src/features/familySize/FamilySizeTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart } from '../../components/charts/BarChart';
import { dataUtils, formatUtils } from '../../utils';

export const FamilySizeTab = () => {
  const { data } = useSelector((state) => state.dashboard);
  const familySizeData = data.familySize || [];
  
  const [filters, setFilters] = useState({
    ac: 'all',
    sizeCategory: 'all',
  });

  const filteredData = useMemo(() => {
    let filtered = [...familySizeData];

    if (filters.ac !== 'all') {
      filtered = filtered.filter(d => d.ac_no === filters.ac);
    }

    if (filters.sizeCategory !== 'all') {
      switch (filters.sizeCategory) {
        case 'small':
          filtered = filtered.filter(d => d.is_small_family === 1);
          break;
        case 'normal':
          filtered = filtered.filter(d => d.family_size >= 2 && d.family_size <= 5);
          break;
        case 'large':
          filtered = filtered.filter(d => d.is_large_family === 1);
          break;
      }
    }

    return filtered;
  }, [familySizeData, filters]);

  const uniqueACs = useMemo(() => {
    return dataUtils.unique(familySizeData.map(d => d.ac_no)).sort();
  }, [familySizeData]);

  // Family Size Distribution Chart Data
  const familySizeChartData = useMemo(() => {
    const sizeGroups = dataUtils.groupBy(filteredData, 'family_size');
    const sizes = Object.keys(sizeGroups)
      .map(size => parseInt(size))
      .filter(size => !isNaN(size))
      .sort((a, b) => a - b);

    const labels = sizes.map(size => 
      size === 1 ? '1 member' : `${size} members`
    );

    const values = sizes.map(size => 
      dataUtils.sumBy(sizeGroups[size], 'total_families')
    );

    return {
      labels,
      datasets: [{
        label: 'Number of Families',
        data: values,
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          'rgb(37, 99, 235)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      }]
    };
  }, [filteredData]);

  // NEW: Verification Status by Family Size Chart Data
const verificationChartData = useMemo(() => {
  const sizeGroups = dataUtils.groupBy(filteredData, 'family_size');
  const sizes = Object.keys(sizeGroups)
    .map(size => parseInt(size))
    .filter(size => !isNaN(size))
    .sort((a, b) => a - b);

  const sizeLabels = sizes.map(size => `${size} member${size > 1 ? 's' : ''}`);

  const verified = sizes.map(size => 
    dataUtils.sumBy(sizeGroups[size], 'families_with_verified')
  );

  const unverified = sizes.map(size => 
    dataUtils.sumBy(sizeGroups[size], 'families_with_unverified')
  );

  return {
    labels: sizeLabels,
    datasets: [
      {
        label: 'Families with Verified Members',
        data: verified,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 2,
      },
      {
        label: 'Families with Unverified Members',
        data: unverified,
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: '#f59e0b',
        borderWidth: 2,
      }
    ]
  };
}, [filteredData]);

  // NEW: Top 20 ACs by Family Count Chart Data
  const acChartData = useMemo(() => {
    const acGroups = dataUtils.groupBy(filteredData, 'ac_no');
    const acTotals = Object.entries(acGroups).map(([ac, data]) => ({
      ac,
      total: dataUtils.sumBy(data, 'total_families')
    }));

    // Sort by total families and take top 20
    const top20 = acTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);

    return {
      labels: top20.map(item => `AC ${item.ac}`),
      datasets: [{
        label: 'Total Families',
        data: top20.map(item => item.total),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: '#2563eb',
        borderWidth: 2,
      }]
    };
  }, [filteredData]);

  const statistics = useMemo(() => {
    const totalFamilies = dataUtils.sumBy(filteredData, 'total_families');
    const smallFamilies = dataUtils.sumBy(
      filteredData.filter(d => d.is_small_family === 1),
      'total_families'
    );
    const largeFamilies = dataUtils.sumBy(
      filteredData.filter(d => d.is_large_family === 1),
      'total_families'
    );

    let totalMembers = 0;
    filteredData.forEach(record => {
      totalMembers += record.family_size * record.total_families;
    });

    const avgFamilySize = totalFamilies > 0 ? totalMembers / totalFamilies : 0;

    return {
      totalFamilies,
      avgFamilySize,
      smallFamilies,
      largeFamilies,
    };
  }, [filteredData]);

  return (
    <div className="space-y-8">
      {/* Controls Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">
              Assembly Constituency:
            </label>
            <select
              value={filters.ac}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, ac: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All ACs</option>
              {uniqueACs.map((ac) => (
                <option key={ac} value={ac}>
                  AC {ac}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Family Size:</label>
            <select
              value={filters.sizeCategory}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sizeCategory: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small Families</option>
              <option value="normal">Normal Families</option>
              <option value="large">Large Families</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Total Families
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatUtils.formatExactNumber(statistics.totalFamilies)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Average Size
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {statistics.avgFamilySize.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Small Families
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatUtils.formatExactNumber(statistics.smallFamilies)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Large Families
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatUtils.formatExactNumber(statistics.largeFamilies)}
          </p>
        </div>
      </div>

      {/* Charts Grid - 3 Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Size Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm py-20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            👥 Family Size Distribution
          </h3>
          <div className="h-80">
            <BarChart
              data={familySizeChartData}
              title="Number of Families by Size"
              formatTooltip={(value) => formatUtils.formatExactNumber(value)}
            />
          </div>
        </div>

        {/* NEW: Verification Status by Family Size Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm py-20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ✅ Verification Status by Family Size
          </h3>
          <div className="h-80">
            <BarChart
              data={verificationChartData}
              stacked={true}
              formatTooltip={(value) => formatUtils.formatExactNumber(value)}
            />
          </div>
        </div>
      </div>

      {/* NEW: Top 20 ACs by Family Count Chart - Full Width */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🏛️ Top 20 ACs by Family Count
        </h3>
        <div className="h-96">
          <BarChart
            data={acChartData}
            horizontal={true}
            formatTooltip={(value) => formatUtils.formatExactNumber(value)}
          />
        </div>
      </div>
    </div>
  );
};
