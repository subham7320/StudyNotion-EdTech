import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-50"></div>
      <p className="text-yellow-50 ml-3 text-lg font-semibold"></p>
    </div>
  );
};

export default LoadingSpinner;