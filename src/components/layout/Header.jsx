// src/components/layout/Header.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadAllData } from '../../store/slices/dashboardSlice';
import { RefreshCw } from 'lucide-react';

export const Header = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.dashboard);

  const handleRefresh = () => {
    dispatch(loadAllData());
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                📊 Family Phone Analysis Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive analysis of family registration and BLA performance
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Data loaded successfully</span>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw 
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
