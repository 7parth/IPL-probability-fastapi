import { useState } from 'react';
import { PredictionRequest, PredictionResponse, ValidationErrors } from '../types/prediction';
import { predictMatch } from '../services/predictionApi';

const initialFormData: PredictionRequest = {
  batting_team: '',
  bowling_team: '',
  current_score: 0,
  wickets_out: 0,
  overs_completed: 0,
  total_runs_x: 0,
  city: ''
};

export const usePredictionForm = () => {
  const [formData, setFormData] = useState<PredictionRequest>(initialFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.batting_team) {
      newErrors.batting_team = 'Please select a batting team';
    }

    if (!formData.bowling_team) {
      newErrors.bowling_team = 'Please select a bowling team';
    }

    if (formData.batting_team && formData.bowling_team && formData.batting_team === formData.bowling_team) {
      newErrors.general = 'Batting and bowling teams cannot be the same';
    }

    if (formData.current_score < 0) {
      newErrors.current_score = 'Current score must be 0 or greater';
    }

    if (formData.wickets_out < 0 || formData.wickets_out > 10) {
      newErrors.wickets_out = 'Wickets out must be between 0 and 10';
    }

    if (formData.overs_completed < 0 || formData.overs_completed > 20) {
      newErrors.overs_completed = 'Overs completed must be between 0.0 and 20.0';
    }

    if (formData.total_runs_x < 0) {
      newErrors.total_runs_x = 'Target score must be 0 or greater';
    }

    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof PredictionRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear general error when teams change
    if ((field === 'batting_team' || field === 'bowling_team') && errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const submitPrediction = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await predictMatch(formData);
      setPrediction(result);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPrediction(null);
    setErrors({});
  };

  const makeNewPrediction = () => {
    setPrediction(null);
    setErrors({});
  };

  return {
    formData,
    prediction,
    loading,
    errors,
    updateField,
    submitPrediction,
    resetForm,
    makeNewPrediction
  };
};