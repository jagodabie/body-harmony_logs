import { useEffect } from 'react';

import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { useWeightLogsStore } from '../../stores/useWeightLogsStore';
import { WeightLogsList } from './components/WeightLogsList/WeightLogsList';

export const WeightLogs = () => {
  const { loading, fetchWeightLogs } = useWeightLogsStore();

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  return (
    <div className="weight-logs">
      <OverlayLoader isLoading={loading} />
      <WeightLogsList />
    </div>
  );
};