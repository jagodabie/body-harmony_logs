import { useWeightLogsContext } from '../../context/WeightLogsContext';
import WeightLogEditDrawer from '../WeightLogEdit/WeightLogEditModal';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

export const WeightLogsList = () => {
  const context = useWeightLogsContext();
  if (!context) {
    console.error('WeightLogsContext is not available');
    return null;
  }
  const { weightLogs, loading, error, setEditedWeightLog, editedWeightLog } = context;
   

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
            setEditedWeightLog(log);
          }}
          onDelete={() => {}}
        />
      ))}
      { editedWeightLog && (
        <WeightLogEditDrawer
          onClose={() => setEditedWeightLog(null)}
        />
      )}
    </div>
  );
};