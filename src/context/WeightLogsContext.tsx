import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import type {
  FormWeightLog,
  Nullable,
  UpdateWeightLogRequest,
  WeightLog,
} from '../types/WeightLog';
import { WeightLogTypes, WeightLogUnits } from '../types/WeightLog';

interface WeightLogsProviderProps {
  children: ReactNode;
}
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const WeightLogsContext = createContext<{
  weightLogs: WeightLog[];
  loading: boolean;
  error: Nullable<string>;
  editedWeightLog: Nullable<UpdateWeightLogRequest>;
  updateWeightLog: (logData: FormWeightLog) => Promise<void>;
  createWeightLog: (logData: FormWeightLog) => Promise<void>;
  setEditedWeightLog: React.Dispatch<Nullable<UpdateWeightLogRequest>>;
  deleteWeightLog: (logId: string) => Promise<void>;
  closeModal: () => void;
} | null>(null);

export const WeightLogsProvider = ({ children }: WeightLogsProviderProps) => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedWeightLog, setEditedWeightLog] =
    useState<Nullable<UpdateWeightLogRequest>>(null);

  const closeModal = () => {
    setEditedWeightLog(null);
  };

  useEffect(() => {
    const fetchWeightLogs = async() => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://web-production-e7a84.up.railway.app/logs'
        );
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

  const updatedLog = (
    logData: FormWeightLog,
    editedWeightLog: UpdateWeightLogRequest
  ): UpdateWeightLogRequest => {
    return {
      _id: editedWeightLog?._id,
      value: logData.weight || editedWeightLog?.value,
      unit: editedWeightLog.unit,
      notes: logData.notes || editedWeightLog?.notes,
      date: logData.date || editedWeightLog?.date,
      type: editedWeightLog?.type,
    };
  };

  const updateWeightLog = async(logData: FormWeightLog) => {
    setLoading(true);
    setError(null);
    if (!editedWeightLog) {
      throw new Error('No edited weight log found');
    }
    const body = updatedLog(logData, editedWeightLog!);
    try {
      const response = await fetch(
        `https://web-production-e7a84.up.railway.app/logs/${editedWeightLog?._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...body,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update weight log');
      }
      const updatedLog = await response.json();
      setWeightLogs((prev) =>
        prev.map((log) => (log._id === updatedLog._id ? updatedLog : log))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createWeightLog = async(logData: FormWeightLog) => {
    setLoading(true);
    setError(null);
    try {
      const { weight, notes, date } = logData;
      const response = await fetch(`${apiUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: weight,
          notes,
          date,
          type: WeightLogTypes[0],
          unit: WeightLogUnits[0],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create weight log');
      }
      const newLog = await response.json();
      setWeightLogs((prev) => [newLog, ...prev]); // Zaktualizuj stan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWeightLog = async(logId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/logs/${logId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete weight log');
      }
      setWeightLogs((prev) => prev.filter((log) => log._id !== logId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeightLogsContext.Provider
      value={{
        weightLogs,
        loading,
        error,
        updateWeightLog,
        createWeightLog,
        editedWeightLog,
        setEditedWeightLog,
        deleteWeightLog,
        closeModal,
      }}
    >
      {children}
    </WeightLogsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeightLogsContext = () => {
  return useContext(WeightLogsContext);
};
