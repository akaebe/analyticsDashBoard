// src/features/overview/components/MetricsRow.jsx
import React from 'react';
import { Users, Activity, BarChart3, MapPin } from 'lucide-react';

export const MetricsRow = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Records',
      value: metrics.totalRecords.toLocaleString(),
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'ACs Covered',
      value: `${metrics.acsCovered}/234`,
      icon: MapPin,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'BLA Agents',
      value: metrics.totalBLAs.toLocaleString(),
      icon: Users,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Families Analyzed',
      value: metrics.totalFamilies.toLocaleString(),
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
