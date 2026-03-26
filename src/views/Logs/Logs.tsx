import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { ChartPlaceholder } from './components/ChartPlaceholder/ChartPlaceholder';
import { LogList } from './components/LogList/LogList';
import { LogTabs } from './components/LogTabs/LogTabs';
import { useLogs } from './hooks/useLogs';

import './index.css';

export const Logs = () => {
  const {
    activeType,
    logs,
    loading,
    editedLog,
    setActiveType,
    createLog,
    updateLog,
    deleteLog,
    setEditedLog,
  } = useLogs();

  return (
    <div className="logs">
      <OverlayLoader isLoading={loading} />
      <LogTabs activeType={activeType} onChangeType={setActiveType} />
      <ChartPlaceholder />
      <LogList
        logs={logs}
        activeType={activeType}
        editedLog={editedLog}
        onCreateLog={createLog}
        onUpdateLog={updateLog}
        onDeleteLog={deleteLog}
        onSetEditedLog={setEditedLog}
      />
    </div>
  );
};
