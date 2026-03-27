import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLogsStore } from '../../../stores/useLogsStore';
import type { BodyLog, FormLog, UpdateLogRequest } from '../../../types/BodyLog';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchLogsByType = vi.fn();
const mockCreateLogApi = vi.fn();
const mockUpdateLogApi = vi.fn();
const mockDeleteLogApi = vi.fn();

vi.mock('../../../api/bodyLogs.api', () => ({
  fetchLogsByType: (...args: unknown[]) => mockFetchLogsByType(...args),
  createLog: (...args: unknown[]) => mockCreateLogApi(...args),
  updateLog: (...args: unknown[]) => mockUpdateLogApi(...args),
  deleteLog: (...args: unknown[]) => mockDeleteLogApi(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeLog = (id: string): BodyLog => ({
  id,
  type: 'weight',
  value: '70',
  unit: 'kg',
  notes: '',
  date: '2026-03-27',
  createdAt: '2026-03-27T10:00:00.000Z',
  updatedAt: '2026-03-27T10:00:00.000Z',
});

const FORM_LOG: FormLog = { value: '75', notes: 'test', date: '2026-03-27' };

const reset = () =>
  useLogsStore.setState({
    activeType: 'weight',
    logs: [],
    loading: false,
    editedLog: null,
  });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useLogsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reset();
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      const { activeType, logs, loading, editedLog } = useLogsStore.getState();
      expect(activeType).toBe('weight');
      expect(logs).toEqual([]);
      expect(loading).toBe(false);
      expect(editedLog).toBeNull();
    });
  });

  describe('setActiveType', () => {
    it('changes activeType', () => {
      useLogsStore.getState().setActiveType('temperature');
      expect(useLogsStore.getState().activeType).toBe('temperature');
    });

    it('clears logs when switching type', () => {
      useLogsStore.setState({ logs: [makeLog('1')] });
      useLogsStore.getState().setActiveType('mood');
      expect(useLogsStore.getState().logs).toEqual([]);
    });

    it('clears editedLog when switching type', () => {
      useLogsStore.setState({
        editedLog: { id: '1', type: 'weight', value: '70', unit: 'kg', notes: '', date: '2026-03-27' },
      });
      useLogsStore.getState().setActiveType('activity');
      expect(useLogsStore.getState().editedLog).toBeNull();
    });
  });

  describe('setEditedLog', () => {
    it('sets editedLog', () => {
      const log: UpdateLogRequest = {
        id: '1',
        type: 'weight',
        value: '70',
        unit: 'kg',
        notes: 'note',
        date: '2026-03-27',
      };
      useLogsStore.getState().setEditedLog(log);
      expect(useLogsStore.getState().editedLog).toEqual(log);
    });

    it('can clear editedLog by setting null', () => {
      useLogsStore.setState({
        editedLog: { id: '1', type: 'weight', value: '70', unit: 'kg', notes: '', date: '2026-03-27' },
      });
      useLogsStore.getState().setEditedLog(null);
      expect(useLogsStore.getState().editedLog).toBeNull();
    });
  });

  describe('fetchLogs', () => {
    it('fetches logs for the active type and updates state', async () => {
      const logs = [makeLog('1'), makeLog('2')];
      mockFetchLogsByType.mockResolvedValue(logs);

      await useLogsStore.getState().fetchLogs();

      expect(mockFetchLogsByType).toHaveBeenCalledWith('weight');
      expect(useLogsStore.getState().logs).toEqual(logs);
    });

    it('calls fetchLogsByType with current activeType', async () => {
      useLogsStore.setState({ activeType: 'mood' });
      mockFetchLogsByType.mockResolvedValue([]);

      await useLogsStore.getState().fetchLogs();

      expect(mockFetchLogsByType).toHaveBeenCalledWith('mood');
    });

    it('resets loading to false after fetch', async () => {
      mockFetchLogsByType.mockResolvedValue([]);
      await useLogsStore.getState().fetchLogs();
      expect(useLogsStore.getState().loading).toBe(false);
    });

    it('resets loading to false on API error', async () => {
      mockFetchLogsByType.mockRejectedValue(new Error('API error'));
      try {
        await useLogsStore.getState().fetchLogs();
      } catch (_) {
        // loading should reset in finally block
      }
      expect(useLogsStore.getState().loading).toBe(false);
    });
  });

  describe('createLog', () => {
    it('calls createLogApi with correct payload', async () => {
      const newLog = makeLog('new-1');
      mockCreateLogApi.mockResolvedValue(newLog);
      mockFetchLogsByType.mockResolvedValue([newLog]);

      await useLogsStore.getState().createLog(FORM_LOG);

      expect(mockCreateLogApi).toHaveBeenCalledWith({
        value: FORM_LOG.value,
        notes: FORM_LOG.notes,
        date: FORM_LOG.date,
        type: 'weight',
        unit: 'kg',
      });
    });

    it('prepends the new log to the list', async () => {
      const existing = makeLog('old');
      useLogsStore.setState({ logs: [existing] });

      const newLog = { ...makeLog('new'), value: '80' };
      mockCreateLogApi.mockResolvedValue(newLog);
      mockFetchLogsByType.mockResolvedValue([newLog, existing]);

      await useLogsStore.getState().createLog(FORM_LOG);

      expect(useLogsStore.getState().logs[0].id).toBe('new');
    });

    it('uses null unit for types without a default', async () => {
      useLogsStore.setState({ activeType: 'sleep' });
      const newLog = makeLog('1');
      mockCreateLogApi.mockResolvedValue(newLog);
      mockFetchLogsByType.mockResolvedValue([newLog]);

      await useLogsStore.getState().createLog(FORM_LOG);

      expect(mockCreateLogApi).toHaveBeenCalledWith(
        expect.objectContaining({ unit: null })
      );
    });
  });

  describe('updateLog', () => {
    const editedLog: UpdateLogRequest = {
      id: 'log-1',
      type: 'weight',
      value: '70',
      unit: 'kg',
      notes: 'old note',
      date: '2026-03-20',
    };

    it('throws when editedLog is null', async () => {
      await expect(
        useLogsStore.getState().updateLog(FORM_LOG)
      ).rejects.toThrow('No edited log found');
    });

    it('calls updateLogApi with merged data', async () => {
      useLogsStore.setState({ editedLog, logs: [makeLog('log-1')] });
      const updated = { ...makeLog('log-1'), value: '75' };
      mockUpdateLogApi.mockResolvedValue(updated);

      await useLogsStore.getState().updateLog({ value: '75', notes: 'new note', date: '2026-03-27' });

      expect(mockUpdateLogApi).toHaveBeenCalledWith('log-1', expect.objectContaining({
        id: 'log-1',
        value: '75',
        notes: 'new note',
        date: '2026-03-27',
      }));
    });

    it('replaces updated log in state and clears editedLog', async () => {
      const original = makeLog('log-1');
      const updated = { ...original, value: '80' };
      useLogsStore.setState({ editedLog, logs: [original] });
      mockUpdateLogApi.mockResolvedValue(updated);

      await useLogsStore.getState().updateLog(FORM_LOG);

      expect(useLogsStore.getState().logs[0].value).toBe('80');
      expect(useLogsStore.getState().editedLog).toBeNull();
    });
  });

  describe('deleteLog', () => {
    it('calls deleteLogApi with the correct id', async () => {
      useLogsStore.setState({ logs: [makeLog('log-1')] });
      mockDeleteLogApi.mockResolvedValue(undefined);

      await useLogsStore.getState().deleteLog('log-1');

      expect(mockDeleteLogApi).toHaveBeenCalledWith('log-1');
    });

    it('removes the deleted log from state', async () => {
      useLogsStore.setState({ logs: [makeLog('log-1'), makeLog('log-2')] });
      mockDeleteLogApi.mockResolvedValue(undefined);

      await useLogsStore.getState().deleteLog('log-1');

      const ids = useLogsStore.getState().logs.map(l => l.id);
      expect(ids).not.toContain('log-1');
      expect(ids).toContain('log-2');
    });

    it('resets loading to false after delete', async () => {
      useLogsStore.setState({ logs: [makeLog('log-1')] });
      mockDeleteLogApi.mockResolvedValue(undefined);

      await useLogsStore.getState().deleteLog('log-1');

      expect(useLogsStore.getState().loading).toBe(false);
    });
  });
});
