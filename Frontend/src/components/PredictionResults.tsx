import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { PredictionResponse } from '../types/prediction';

interface PredictionResultsProps {
  prediction: PredictionResponse;
  onNewPrediction: () => void;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction,
  onNewPrediction
}) => {
  const battingProb = parseFloat(prediction.batting_win_prob.replace('%', ''));
  const bowlingProb = parseFloat(prediction.bowling_win_prob.replace('%', ''));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Match Prediction Results</h3>
        <p className="text-gray-600">Based on current match situation</p>
      </div>

      <div className="space-y-6">
        {/* Batting Team Result */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-green-800 text-lg">{prediction.batting_team}</h4>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-700">{prediction.batting_win_prob}</span>
            </div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${battingProb}%` }}
            />
          </div>
        </div>

        {/* Bowling Team Result */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-blue-800 text-lg">{prediction.bowling_team}</h4>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-2xl font-bold text-blue-700">{prediction.bowling_win_prob}</span>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${bowlingProb}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onNewPrediction}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Make New Prediction
        </button>
      </div>
    </div>
  );
};