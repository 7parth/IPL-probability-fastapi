import React from 'react';
import { Activity, Target, AlertCircle } from 'lucide-react';
import { TEAMS, CITIES } from './constants/options';
import { usePredictionForm } from './hooks/usePredictionForm';
import { FormField } from './components/FormField';
import { PredictionResults } from './components/PredictionResults';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const {
    formData,
    prediction,
    loading,
    errors,
    updateField,
    submitPrediction,
    resetForm,
    makeNewPrediction
  } = usePredictionForm();

  if (prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <PredictionResults prediction={prediction} onNewPrediction={makeNewPrediction} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-full shadow-lg">
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Cricket Match Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Predict the winning probability based on current match situation using advanced analytics
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700 font-medium">{errors.general}</p>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); submitPrediction(); }} className="space-y-6">
              {/* Team Selection Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Batting Team" error={errors.batting_team}>
                  <select
                    value={formData.batting_team}
                    onChange={(e) => updateField('batting_team', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Select batting team</option>
                    {TEAMS.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Bowling Team" error={errors.bowling_team}>
                  <select
                    value={formData.bowling_team}
                    onChange={(e) => updateField('bowling_team', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Select bowling team</option>
                    {TEAMS.map(team => (
                      <option key={team} value={team} disabled={team === formData.batting_team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Score and Wickets Row */}
              <div className="grid md:grid-cols-3 gap-6">
                <FormField label="Current Score" error={errors.current_score}>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_score}
                    onChange={(e) => updateField('current_score', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </FormField>

                <FormField label="Wickets Out" error={errors.wickets_out}>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.wickets_out}
                    onChange={(e) => updateField('wickets_out', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </FormField>

                <FormField label="Overs Completed" error={errors.overs_completed}>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={formData.overs_completed}
                    onChange={(e) => updateField('overs_completed', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.0"
                  />
                </FormField>
              </div>

              {/* Target and City Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Target Score" error={errors.total_runs_x}>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.total_runs_x}
                      onChange={(e) => updateField('total_runs_x', parseInt(e.target.value) || 0)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </FormField>

                <FormField label="City" error={errors.city}>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Select city</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? 'Predicting...' : 'Predict Outcome'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 border border-gray-300"
                >
                  Reset Form
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Powered by advanced machine learning algorithms for accurate cricket predictions
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;