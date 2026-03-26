import { create } from 'zustand';

import {
  createLog as createWeightLogApi,
  deleteLog as deleteWeightLogApi,
  fetchLogs as fetchWeightLogsApi,
  updateLog as updateWeightLogApi,
} from '../api/bodyLogs.api';
import type {
  BodyLog,
  FormLog,
  Nullable,
  UpdateLogRequest,
} from '../types/BodyLog';
import { LogTypes, LogUnits } from '../types/BodyLog';
import { handleAsyncOperation } from './storeHelpers';

type WeightLogsState = {
  weightLogs: BodyLog[];
  loading: boolean;
  editedWeightLog: Nullable<UpdateLogRequest>;
  fetchWeightLogs: () => Promise<void>;
  updateWeightLog: (logData: FormLog) => Promise<void>;
  createWeightLog: (logData: FormLog) => Promise<void>;
  deleteWeightLog: (logId: string) => Promise<void>;
  setEditedWeightLog: (log: Nullable<UpdateLogRequest>) => void;
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

  updateWeightLog: async (logData: FormLog) => {
    const state = useWeightLogsStore.getState();
    if (!state.editedWeightLog) {
      throw new Error('No edited weight log found');
    }

    const updatedLog: UpdateLogRequest = {
      id: state.editedWeightLog.id,
      value: logData.value || state.editedWeightLog.value,
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
          state.editedWeightLog!.id,
          updatedLog
        );
        set(state => ({
          weightLogs: state.weightLogs.map(log =>
            log.id === updatedLogResponse.id ? updatedLogResponse : log
          ),
          editedWeightLog: null,
        }));
        return updatedLogResponse;
      },
      showSuccessMessage: 'Weight log updated successfully',
      showErrorMessage: true,
    });
  },

  createWeightLog: async (logData: FormLog) => {
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const { value, notes, date } = logData;
        const newLog = await createWeightLogApi({
          value,
          notes,
          date,
          type: LogTypes[0],
          unit: LogUnits[0],
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
          weightLogs: state.weightLogs.filter(log => log.id !== logId),
        }));
      },
      showSuccessMessage: 'Weight log deleted successfully',
      showErrorMessage: true,
    });
  },

  setEditedWeightLog: (log: Nullable<UpdateLogRequest>) => {
    set({ editedWeightLog: log });
  },

  closeModal: () => {
    set({ editedWeightLog: null });
  },
}));

