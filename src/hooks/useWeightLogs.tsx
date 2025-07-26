import { useEffect, useState } from 'react';

import type { CreateWeightLogRequest, UpdateWeightLogRequest, WeightLog } from '../types/WeightLog';

const API_BASE_URL = 'https://web-production-e7a84.up.railway.app';

export const useWeightLogs = () => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all weight logs
  const fetchWeightLogs = async() => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch weight logs');
      }
      const data = await response.json();
      setWeightLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new weight log
  const createWeightLog = async(logData: CreateWeightLogRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      if (!response.ok) {
        throw new Error('Failed to create weight log');
      }
      const newLog = await response.json();
      setWeightLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing weight log
  const updateWeightLog = async(logData: UpdateWeightLogRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${logData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      if (!response.ok) {
        throw new Error('Failed to update weight log');
      }
      const updatedLog = await response.json();
      setWeightLogs(prev => prev.map(log => log._id === updatedLog._id ? updatedLog : log));
      return updatedLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete weight log
  const deleteWeightLog = async(id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete weight log');
      }
      setWeightLogs(prev => prev.filter(log => log._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load weight logs on mount
  useEffect(() => {
    fetchWeightLogs();
  }, []);

  return {
    weightLogs,
    loading,
    error,
    fetchWeightLogs,
    createWeightLog,
    updateWeightLog,
    deleteWeightLog,
  };
}; 