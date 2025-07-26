import axios from 'axios';
import { PredictionRequest, PredictionResponse } from '../types/prediction';

const API_BASE_URL = 'https://ipl-probability-backend.onrender.com';

export const predictMatch = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data?.detail || 'Validation error occurred');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to the prediction server. Please ensure the backend is running on localhost:8000');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      } else {
        throw new Error(error.response?.data?.message || 'Prediction failed. Please try again.');
      }
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};