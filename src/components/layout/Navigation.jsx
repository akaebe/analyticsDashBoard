// src/components/layout/Navigation.jsx
import React from 'react';
import { BarChart3, Users, Activity, Clock, Home } from 'lucide-react';

export const Navigation = ({ currentTab, onTabChange }) => {
  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Home,
      label: 'Overview',
    },
    {
      id: 'family-size',
      name: 'Family Size',
      icon: Users,
      label: 'Family Size Analysis',
    },
    {
      id: 'bla-activity',
      name: 'BLA Activity',
      icon: Activity,
      label: 'BLA Daily Activity',
    },
    {
      id: 'bla-performance',
      name: 'BLA Performance',
      icon: BarChart3,
      label: 'BLA Performance',
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: Clock,
      label: 'Timeline Analysis',
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-3 transition-colors whitespace-nowrap ${
                currentTab === tab.id
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
