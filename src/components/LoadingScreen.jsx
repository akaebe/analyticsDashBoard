// src/components/LoadingScreen.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="mb-8">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Loading Dashboard
        </h2>
        <p className="text-blue-100 mb-6">
          Processing your data and preparing visualizations...
        </p>
        <div className="w-64 bg-blue-500 rounded-full h-2 mx-auto">
          <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-blue-200 text-sm mt-4">
          Please wait while we load your data
        </p>
      </div>
    </div>
  );
};
