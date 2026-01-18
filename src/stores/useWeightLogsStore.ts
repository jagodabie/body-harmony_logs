import { create } from 'zustand';

import {
  createWeightLog as createWeightLogApi,
  deleteWeightLog as deleteWeightLogApi,
  fetchWeightLogs as fetchWeightLogsApi,
  updateWeightLog as updateWeightLogApi,
} from '../api/weightLogs.api';
import type {
  FormWeightLog,
  Nullable,
  UpdateWeightLogRequest,
  WeightLog,
} from '../types/WeightLog';
import { WeightLogTypes, WeightLogUnits } from '../types/WeightLog';
import { handleAsyncOperation } from './storeHelpers';

type WeightLogsState = {
  weightLogs: WeightLog[];
  loading: boolean;
  editedWeightLog: Nullable<UpdateWeightLogRequest>;
  fetchWeightLogs: () => Promise<void>;
  updateWeightLog: (logData: FormWeightLog) => Promise<void>;
  createWeightLog: (logData: FormWeightLog) => Promise<void>;
  deleteWeightLog: (logId: string) => Promise<void>;
  setEditedWeightLog: (log: Nullable<UpdateWeightLogRequest>) => void;
  closeModal: () => void;
};

export const useWeightLogsStore = create<WeightLogsState>(set => ({
  weightLogs: [],
  loading: false,
  editedWeightLog: null,

  fetchWeightLogs: async () => {
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const data = await fetchWeightLogsApi();
        set({ weightLogs: data });
        return data;
      },
      showErrorMessage: true,
    });
  },

  updateWeightLog: async (logData: FormWeightLog) => {
    const state = useWeightLogsStore.getState();
    if (!state.editedWeightLog) {
      throw new Error('No edited weight log found');
    }

    const updatedLog: UpdateWeightLogRequest = {
      _id: state.editedWeightLog._id,
      value: logData.weight || state.editedWeightLog.value,
      unit: state.editedWeightLog.unit,
      notes:
        logData.notes !== undefined
          ? logData.notes
          : state.editedWeightLog.notes,
      date: logData.date || state.editedWeightLog.date,
      type: state.editedWeightLog.type,
    };

    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const updatedLogResponse = await updateWeightLogApi(
          state.editedWeightLog!._id,
          updatedLog
        );
        set(state => ({
          weightLogs: state.weightLogs.map(log =>
            log._id === updatedLogResponse._id ? updatedLogResponse : log
          ),
          editedWeightLog: null,
        }));
        return updatedLogResponse;
      },
      showSuccessMessage: 'Weight log updated successfully',
      showErrorMessage: true,
    });
  },

  createWeightLog: async (logData: FormWeightLog) => {
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const { weight, notes, date } = logData;
        const newLog = await createWeightLogApi({
          value: weight,
          notes,
          date,
          type: WeightLogTypes[0],
          unit: WeightLogUnits[0],
        });
        set(state => ({
          weightLogs: [newLog, ...state.weightLogs],
        }));
        return newLog;
      },
      showSuccessMessage: 'Weight log created successfully',
      showErrorMessage: true,
    });
  },

  deleteWeightLog: async (logId: string) => {
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        await deleteWeightLogApi(logId);
        set(state => ({
          weightLogs: state.weightLogs.filter(log => log._id !== logId),
        }));
      },
      showSuccessMessage: 'Weight log deleted successfully',
      showErrorMessage: true,
    });
  },

  setEditedWeightLog: (log: Nullable<UpdateWeightLogRequest>) => {
    set({ editedWeightLog: log });
  },

  closeModal: () => {
    set({ editedWeightLog: null });
  },
}));

