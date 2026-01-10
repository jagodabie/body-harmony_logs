import { useEffect } from 'react';

import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { Snackbar } from '../../components/Snackbar/Snackbar';
import { useWeightLogsStore } from '../../stores/useWeightLogsStore';
import { WeightLogsList } from './components/WeightLogsList/WeightLogsList';

export const WeightLogs = () => {
  const { loading, snackbar, setSnackbar, fetchWeightLogs } = useWeightLogsStore();

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  return (
    <div className="weight-logs">
      <OverlayLoader isLoading={loading} />
      {snackbar && (
        <Snackbar snackbar={snackbar} onClose={() => setSnackbar(null)} />
      )}
      <WeightLogsList />
    </div>
  );
};