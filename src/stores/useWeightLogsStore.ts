import { create } from 'zustand';

import type {
  FormWeightLog,
  Nullable,
  UpdateWeightLogRequest,
  WeightLog,
} from '../types/WeightLog';
import { WeightLogTypes, WeightLogUnits } from '../types/WeightLog';

type WeightLogsState = {
  weightLogs: WeightLog[];
  loading: boolean;
  editedWeightLog: Nullable<UpdateWeightLogRequest>;
  snackbar: Nullable<{ message: string; type: 'success' | 'error' }>;
  fetchWeightLogs: () => Promise<void>;
  updateWeightLog: (logData: FormWeightLog) => Promise<void>;
  createWeightLog: (logData: FormWeightLog) => Promise<void>;
  deleteWeightLog: (logId: string) => Promise<void>;
  setEditedWeightLog: (log: Nullable<UpdateWeightLogRequest>) => void;
  setSnackbar: (snackbar: Nullable<{ message: string; type: 'success' | 'error' }>) => void;
  closeModal: () => void;
};

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const useWeightLogsStore = create<WeightLogsState>(set => ({
  weightLogs: [],
  loading: false,
  editedWeightLog: null,
  snackbar: null,

  fetchWeightLogs: async () => {
    set({ loading: true });
    try {
      const response = await fetch(
        'https://web-production-e7a84.up.railway.app/logs'
      );
      const data = await response.json();
      set({ weightLogs: data, loading: false });
    } catch {
      set({
        snackbar: { message: 'Failed to fetch weight logs', type: 'error' },
        loading: false,
      });
    }
  },

  updateWeightLog: async (logData: FormWeightLog) => {
    const state = useWeightLogsStore.getState();
    if (!state.editedWeightLog) {
      throw new Error('No edited weight log found');
    }

    set({ loading: true, snackbar: null });

    const updatedLog: UpdateWeightLogRequest = {
      _id: state.editedWeightLog._id,
      value: logData.weight || state.editedWeightLog.value,
      unit: state.editedWeightLog.unit,
      notes: logData.notes !== undefined ? logData.notes : state.editedWeightLog.notes,
      date: logData.date || state.editedWeightLog.date,
      type: state.editedWeightLog.type,
    };

    try {
      const response = await fetch(`${apiUrl}/logs/${state.editedWeightLog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLog),
      });

      if (!response.ok) {
        throw new Error('Failed to update weight log');
      }

      const updatedLogResponse = await response.json();
      set(state => ({
        weightLogs: state.weightLogs.map(log =>
          log._id === updatedLogResponse._id ? updatedLogResponse : log
        ),
        editedWeightLog: null,
        snackbar: { message: 'Weight log updated successfully', type: 'success' },
        loading: false,
      }));
    } catch (err) {
      set({
        snackbar: {
          message: err instanceof Error ? err.message : 'An error occurred',
          type: 'error',
        },
        loading: false,
      });
    }
  },

  createWeightLog: async (logData: FormWeightLog) => {
    set({ loading: true, snackbar: null });

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
        set({
          snackbar: { message: error.details || 'An error occurred', type: 'error' },
          loading: false,
        });
        throw new Error(error.details || 'An error occurred');
      }

      if (!response.ok) {
        throw new Error('Failed to create weight log');
      }

      const newLog = await response.json();
      set(state => ({
        weightLogs: [newLog, ...state.weightLogs],
        snackbar: { message: 'Weight log created successfully', type: 'success' },
        loading: false,
      }));
    } catch (err) {
      const error = err as {
        error: string;
        message?: string;
        details?: string;
      };
      set({
        snackbar: {
          message: error.message || (error?.error as string) || 'An error occurred',
          type: 'error',
        },
        loading: false,
      });
      throw err;
    }
  },

  deleteWeightLog: async (logId: string) => {
    set({ loading: true, snackbar: null });

    try {
      const response = await fetch(`${apiUrl}/logs/${logId}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        const error = await response.json();
        set({
          snackbar: { message: error?.error as string, type: 'error' },
          loading: false,
        });
        throw new Error('Weight log not found');
      }

      if (!response.ok) {
        throw new Error('Failed to delete weight log');
      }

      set(state => ({
        weightLogs: state.weightLogs.filter(log => log._id !== logId),
        snackbar: { message: 'Weight log deleted successfully', type: 'success' },
        loading: false,
      }));
    } catch (err) {
      const error = err as {
        error: string;
        message?: string;
        details?: string;
      };
      set({
        snackbar: {
          message: error.message || 'An error occurred',
          type: 'error',
        },
        loading: false,
      });
    }
  },

  setEditedWeightLog: (log: Nullable<UpdateWeightLogRequest>) => {
    set({ editedWeightLog: log });
  },

  setSnackbar: (snackbar: Nullable<{ message: string; type: 'success' | 'error' }>) => {
    set({ snackbar });
  },

  closeModal: () => {
    set({ editedWeightLog: null });
  },
}));

