import type { BodyLog, LogType, UpdateLogRequest } from '../types/BodyLog';
import { bodyMetricsUrl } from './config';
import { parseApiError } from './errorHandling';

type CreateLogRequest = {
  value: string;
  notes: string;
  date: string;
  type: string;
  unit: string | null;
};

export const fetchLogs = async (): Promise<BodyLog[]> => {
  const response = await fetch(bodyMetricsUrl, {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch logs');
  }

  if (response.status === 304) {
    throw new Error('Logs data not available (cached)');
  }

  return await response.json();
};

export const fetchLogsByType = async (type: LogType): Promise<BodyLog[]> => {
  const response = await fetch(`${bodyMetricsUrl}?type=${type}`, {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, `Failed to fetch ${type} logs`);
  }

  if (response.status === 304) {
    throw new Error(`${type} logs data not available (cached)`);
  }

  return await response.json();
};

export const updateLog = async (id: string, body: UpdateLogRequest): Promise<BodyLog> => {
  const response = await fetch(`${bodyMetricsUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to update log');
  }

  return await response.json();
};

export const createLog = async (body: CreateLogRequest): Promise<BodyLog> => {
  const response = await fetch(bodyMetricsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to create log');
  }

  return await response.json();
};

export const deleteLog = async (logId: string): Promise<void> => {
  const response = await fetch(`${bodyMetricsUrl}/${logId}`, {
    method: 'DELETE',
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to delete log');
  }
};
