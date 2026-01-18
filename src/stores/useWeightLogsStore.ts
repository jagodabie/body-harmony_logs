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
import { extractErrorMessage } from './errorHandling';
import { useUIStore } from './useUIStore';

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
    set({ loading: true });
    try {
      const data = await fetchWeightLogsApi();
      set({ weightLogs: data, loading: false });
    } catch (err) {
      useUIStore.getState().showSnackbar(extractErrorMessage(err), 'error');
      set({ loading: false });
    }
  },

  updateWeightLog: async (logData: FormWeightLog) => {
    const state = useWeightLogsStore.getState();
    if (!state.editedWeightLog) {
      throw new Error('No edited weight log found');
    }

    set({ loading: true });

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

    try {
      const updatedLogResponse = await updateWeightLogApi(
        state.editedWeightLog._id,
        updatedLog
      );
      set(state => ({
        weightLogs: state.weightLogs.map(log =>
          log._id === updatedLogResponse._id ? updatedLogResponse : log
        ),
        editedWeightLog: null,
        loading: false,
      }));
      useUIStore
        .getState()
        .showSnackbar('Weight log updated successfully', 'success');
    } catch (err) {
      useUIStore.getState().showSnackbar(extractErrorMessage(err), 'error');
      set({ loading: false });
      throw err;
    }
  },

  createWeightLog: async (logData: FormWeightLog) => {
    set({ loading: true });

    try {
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
        loading: false,
      }));
      useUIStore
        .getState()
        .showSnackbar('Weight log created successfully', 'success');
    } catch (err) {
      useUIStore.getState().showSnackbar(extractErrorMessage(err), 'error');
      set({ loading: false });
      throw err;
    }
  },

  deleteWeightLog: async (logId: string) => {
    set({ loading: true });

    try {
      await deleteWeightLogApi(logId);

      set(state => ({
        weightLogs: state.weightLogs.filter(log => log._id !== logId),
        loading: false,
      }));
      useUIStore
        .getState()
        .showSnackbar('Weight log deleted successfully', 'success');
    } catch (err) {
      useUIStore.getState().showSnackbar(extractErrorMessage(err), 'error');
      set({ loading: false });
    }
  },

  setEditedWeightLog: (log: Nullable<UpdateWeightLogRequest>) => {
    set({ editedWeightLog: log });
  },

  closeModal: () => {
    set({ editedWeightLog: null });
  },
}));

