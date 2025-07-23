import { useWeightLogs } from '../../hooks/useWeightLogs';

export const WeightLogsList = () => {
  const { weightLogs, loading, error } = useWeightLogs();

  return (
    <div>
      <h1>Weight Logs</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weightLogs.map((log) => (
        <div key={log._id}>{log.type} - {log.value} {log.unit}</div>
      ))}
    </div>
  );
};