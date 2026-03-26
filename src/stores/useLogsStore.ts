import { create } from 'zustand';

import {
  createLog as createLogApi,
  deleteLog as deleteLogApi,
  fetchLogsByType,
  updateLog as updateLogApi,
} from '../api/bodyLogs.api';
import type {
  BodyLog,
  FormLog,
  LogType,
  LogUnit,
  Nullable,
  UpdateLogRequest,
} from '../types/BodyLog';
import { handleAsyncOperation } from './storeHelpers';

const DEFAULT_UNITS: Record<string, LogUnit> = {
  weight: 'kg',
  temperature: '°C',
  mood: 'pts',
  activity: 'min',
};

type LogsState = {
  activeType: LogType;
  logs: BodyLog[];
  loading: boolean;
  editedLog: Nullable<UpdateLogRequest>;
  setActiveType: (type: LogType) => void;
  fetchLogs: () => Promise<void>;
  createLog: (logData: FormLog) => Promise<void>;
  updateLog: (logData: FormLog) => Promise<void>;
  deleteLog: (logId: string) => Promise<void>;
  setEditedLog: (log: Nullable<UpdateLogRequest>) => void;
};

export const useLogsStore = create<LogsState>((set, get) => ({
  activeType: 'weight',
  logs: [],
  loading: false,
  editedLog: null,

  setActiveType: (type: WeightLogType) => {
    set({ activeType: type, logs: [], editedLog: null });
  },

  fetchLogs: async () => {
    const { activeType } = get();
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const data = await fetchLogsByType(activeType);
        set({ logs: data });
        return data;
      },
      showErrorMessage: true,
    });
  },

  createLog: async (logData: FormLog) => {
    const { activeType, fetchLogs } = get();
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const newLog = await createLogApi({
          value: logData.value,
          notes: logData.notes,
          date: logData.date,
          type: activeType,
          unit: DEFAULT_UNITS[activeType] ?? null,
        });
        set(state => ({ logs: [newLog, ...state.logs] }));
        return newLog;
      },
      onSuccess: () => fetchLogs(),
      showSuccessMessage: 'Log created successfully',
      showErrorMessage: true,
    });
  },

  updateLog: async (logData: FormLog) => {
    const { editedLog } = get();
    if (!editedLog) {
      throw new Error('No edited log found');
    }

    const updatedLog: UpdateLogRequest = {
      id: editedLog.id,
      value: logData.value || editedLog.value,
      unit: editedLog.unit,
      notes: logData.notes !== undefined ? logData.notes : editedLog.notes,
      date: logData.date || editedLog.date,
      type: editedLog.type,
    };

    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        const updatedLogResponse = await updateLogApi(editedLog.id, updatedLog);
        set(state => ({
          logs: state.logs.map(log =>
            log.id === updatedLogResponse.id ? updatedLogResponse : log
          ),
          editedLog: null,
        }));
        return updatedLogResponse;
      },
      showSuccessMessage: 'Log updated successfully',
      showErrorMessage: true,
    });
  },

  deleteLog: async (logId: string) => {
    await handleAsyncOperation({
      setLoading: (loading) => set({ loading }),
      operation: async () => {
        await deleteLogApi(logId);
        set(state => ({
          logs: state.logs.filter(log => log.id !== logId),
        }));
      },
      showSuccessMessage: 'Log deleted successfully',
      showErrorMessage: true,
    });
  },

  setEditedLog: (log: Nullable<UpdateLogRequest>) => {
    set({ editedLog: log });
  },
}));
