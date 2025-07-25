import { useWeightLogs } from '../../hooks/useWeightLogs';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

export const WeightLogsList = () => {
  const { weightLogs, loading, error } = useWeightLogs();

  return (
    <div>
      <h1>Weight Logs</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weightLogs.map((log) => (
      <WeightLogItem
        key={log._id}
        weightLog={log}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      ))}
    </div>
  );
};