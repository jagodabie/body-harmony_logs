import { useState } from 'react';

import { useWeightLogs } from '../../hooks/useWeightLogs';
import type { WeightLog } from '../../types/WeightLog';
import WeightLogEditDrawer from '../WeightLogEdit/WeightLogEditModal';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

export const WeightLogsList = () => {
  const { weightLogs, loading, error } = useWeightLogs();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedWeightLog, setSelectedWeightLog] = useState<WeightLog | null>(null);

  return (
    <div>
      <h1>Weight Logs</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weightLogs.map((log) => (
      <WeightLogItem
        key={log._id}
        weightLog={log}
        onEdit={() => {
          setIsEditDrawerOpen(true);
          setSelectedWeightLog(log);
        }}
        onDelete={() => {}}
      />
      ))}
      {isEditDrawerOpen  && selectedWeightLog && <WeightLogEditDrawer weightLog={selectedWeightLog} onClose={() => setIsEditDrawerOpen(false)} />}
    </div>
  );
};