import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-gray-700">Analyzing Match...</p>
        <p className="text-sm text-gray-500">Please wait while we predict the outcome</p>
      </div>
    </div>
  );
};