import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import type { UpdateWeightLogRequest, WeightLog } from '../types/WeightLog';

interface WeightLogsProviderProps {
  children: ReactNode;
}

const WeightLogsContext = createContext<{
  weightLogs: WeightLog[];
  loading: boolean;
  error: string | null;
  updateWeightLog: (logData: UpdateWeightLogRequest) => Promise<void>;
  editedWeightLog: WeightLog | null;
  setEditedWeightLog: React.Dispatch<React.SetStateAction<WeightLog | null>>;
  closeModal: () => void;
} | null>(null);

export const WeightLogsProvider = ({ children }: WeightLogsProviderProps) => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedWeightLog, setEditedWeightLog] = useState<WeightLog | null>(null);

  const closeModal = () => {
    setEditedWeightLog(null);
  };

  useEffect(() => {
    const fetchWeightLogs = async() => {
      setLoading(true);
      try {
        const response = await fetch('https://web-production-e7a84.up.railway.app/logs');
        const data = await response.json();
        setWeightLogs(data);
      } catch {
        setError('Failed to fetch weight logs');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightLogs();
  }, []);

  const updateWeightLog = async(logData: UpdateWeightLogRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://web-production-e7a84.up.railway.app/logs/${logData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      if (!response.ok) {
        throw new Error('Failed to update weight log');
      }
      const updatedLog = await response.json();
      closeModal();
      setWeightLogs(prev => prev.map(log => (log._id === updatedLog._id ? updatedLog : log)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeightLogsContext.Provider value={{ weightLogs, loading, error, updateWeightLog, editedWeightLog, setEditedWeightLog, closeModal }}>
      {children}
    </WeightLogsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeightLogsContext = () => {
  return useContext(WeightLogsContext);
};
