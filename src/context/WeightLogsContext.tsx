import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Snackbar } from '../components/Snackbar/Snackbar';
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
  editedWeightLog: Nullable<UpdateWeightLogRequest>;
  updateWeightLog: (logData: FormWeightLog) => Promise<void>;
  createWeightLog: (logData: FormWeightLog) => Promise<void>;
  setEditedWeightLog: React.Dispatch<Nullable<UpdateWeightLogRequest>>;
  deleteWeightLog: (logId: string) => Promise<void>;
  closeModal: () => void;
  snackbar: Nullable<{ message: string; type: 'success' | 'error' }>;
  setSnackbar: React.Dispatch<Nullable<{ message: string; type: 'success' | 'error' }>>;
} | null>(null);

export const WeightLogsProvider = ({ children }: WeightLogsProviderProps) => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<Nullable<{ message: string; type: 'success' | 'error' }>>(null);
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
      } catch  {
        setSnackbar({ message: 'Failed to fetch weight logs', type: 'error' });
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
    setSnackbar(null);
    if (!editedWeightLog) {
      throw new Error('No edited weight log found');
    }
    const body = updatedLog(logData, editedWeightLog!);
    try {
      const response = await fetch(
        `${apiUrl}/logs/${editedWeightLog?._id}`,
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
      setSnackbar({ message: 'Weight log updated successfully', type: 'success' });
    } catch (err) {
      setSnackbar({ message: err instanceof Error ? err.message : 'An error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const createWeightLog = async(logData: FormWeightLog) => {
    setLoading(true);
    setSnackbar(null);
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
      if (response.status === 400) {
        const error = await response.json();
        setSnackbar({ message: error.details || 'An error occurred', type: 'error' });
        throw new Error(error.details || 'An error occurred');
      }
      if (!response.ok) {
        throw new Error('Failed to create weight log');
      }
      const newLog = await response.json();
      setWeightLogs((prev) => [newLog, ...prev]); // Zaktualizuj stan
      setSnackbar({ message: 'Weight log created successfully', type: 'success' });
    } catch (err) {
      const error = err as {
        error: string;
        message?: string;
        details?: string;
      };
      setSnackbar({ message: error.message || (error?.error as string) || 'An error occurred', type: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWeightLog = async(logId: string) => {
    setLoading(true);
    setSnackbar(null);
    try {
      const response = await fetch(`${apiUrl}/logs/${logId}`, {
        method: 'DELETE',
      });
      if (response.status === 404) {
        const error = await response.json();
        setSnackbar({ message: (error?.error as string), type: 'error' });
        throw new Error('Weight log not found');
      }
      if (!response.ok) {
        throw new Error('Failed to delete weight log');
      }
      setWeightLogs((prev) => prev.filter((log) => log._id !== logId));
      setSnackbar({ message: 'Weight log deleted successfully', type: 'success' });
    } catch (err) {
      const error = err as {
        error: string;
        message?: string;
        details?: string;
      };
      setSnackbar({ message: error.message  || 'An error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeightLogsContext.Provider
      value={{
        weightLogs,
        loading,
        updateWeightLog,
        createWeightLog,
        editedWeightLog,
        setEditedWeightLog,
        deleteWeightLog,
        closeModal,
        snackbar,
        setSnackbar,
      }}
    >
      <>
        {snackbar && (
          <Snackbar
            snackbar={snackbar}
            onClose={() => setSnackbar(null)}
          />
        )}
        {children}
      </>
    </WeightLogsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeightLogsContext = () => {
  return useContext(WeightLogsContext);
};
