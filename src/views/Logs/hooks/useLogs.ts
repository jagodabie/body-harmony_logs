import { useEffect } from 'react';

import { useLogsStore } from '../../../stores/useLogsStore';

export const useLogs = () => {
  const {
    activeType,
    logs,
    loading,
    editedLog,
    setActiveType,
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    setEditedLog,
  } = useLogsStore();

  useEffect(() => {
    fetchLogs();
  }, [activeType, fetchLogs]);

  return {
    activeType,
    logs,
    loading,
    editedLog,
    setActiveType,
    createLog,
    updateLog,
    deleteLog,
    setEditedLog,
  };
};
