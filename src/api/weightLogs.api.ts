import type { UpdateWeightLogRequest, WeightLog } from '../types/WeightLog';
import { parseApiError } from './errorHandling';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

type CreateWeightLogRequest = {
  value: string;
  notes: string;
  date: string;
  type: string;
  unit: string | null;
};

export const fetchWeightLogs = async (): Promise<WeightLog[]> => {
  const response = await fetch(`${apiUrl}/logs`, {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch weight logs');
  }

  // Handle 304 Not Modified - response has no body
  if (response.status === 304) {
    throw new Error('Weight logs data not available (cached)');
  }

  return await response.json();
};

export const updateWeightLog = async (
  id: string,
  body: UpdateWeightLogRequest
): Promise<WeightLog> => {
  const response = await fetch(`${apiUrl}/logs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to update weight log');
  }

  return await response.json();
};

export const createWeightLog = async (
  body: CreateWeightLogRequest
): Promise<WeightLog> => {
  const response = await fetch(`${apiUrl}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to create weight log');
  }

  return await response.json();
};

export const deleteWeightLog = async (logId: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/logs/${logId}`, {
    method: 'DELETE',
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to delete weight log');
  }
};

