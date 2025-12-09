
import React from 'react';
import type { AnalysisResult } from '../types';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const getRipenessColor = (ripeness: AnalysisResult['ripeness']) => {
  switch (ripeness) {
    case 'Perfectly Ripe':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Almost Ripe':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Overripe':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Unripe':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getQualityColor = (quality: AnalysisResult['quality']) => {
  switch (quality) {
    case 'Excellent':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Good':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Fair':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Poor':
      return 'bg-pink-100 text-pink-800 border-pink-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const InfoCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="flex-1 min-w-[120px] bg-white/50 p-4 rounded-lg shadow-sm border text-center">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className={`mt-1 inline-block px-3 py-1 text-sm font-semibold rounded-full border ${colorClass}`}>
            {value}
        </span>
    </div>
);


const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  return (
    <div className="animate-fade-in bg-gradient-to-br from-white/80 to-transparent p-6 rounded-xl border border-gray-200 shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center capitalize">
        Analysis for: {result.fruitName}
      </h2>
      
      <div className="flex flex-wrap gap-4 justify-center mb-6">
         <InfoCard title="Ripeness" value={result.ripeness} colorClass={getRipenessColor(result.ripeness)} />
         <InfoCard title="Quality" value={result.quality} colorClass={getQualityColor(result.quality)} />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-600 mb-1">AI Justification:</p>
        <p className="text-gray-700 italic">"{result.justification}"</p>
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
