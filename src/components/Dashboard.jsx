// src/components/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadAllData, setCurrentTab } from '../store/slices/dashboardSlice';
import { Header } from './layout/Header';
import { Navigation } from './layout/Navigation';
import { LoadingScreen } from './LoadingScreen';
import { OverviewTab } from '../features/overview/OverviewTab';
import { FamilySizeTab } from '../features/familySize/FamilySizeTab';
import { BLAActivityTab } from '../features/blaActivity/BLAActivityTab';
import { BLAPerformanceTab } from '../features/blaPerformance/BLAPerformanceTab';
import { TimelineTab } from '../features/timeline/TimelineTab';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentTab, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(loadAllData());
  }, [dispatch]);

  const handleTabChange = (tabName) => {
    dispatch(setCurrentTab(tabName));
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewTab />;
      case 'family-size':
        return <FamilySizeTab />;
      case 'bla-activity':
        return <BLAActivityTab />;
      case 'bla-performance':
        return <BLAPerformanceTab />;
      case 'timeline':
        return <TimelineTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {renderTabContent()}
      </main>
    </div>
  );
};
