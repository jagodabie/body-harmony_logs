import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { useWeightLogsContext } from '../../context/WeightLogsContext';
import { type FormWeightLog, WeightLogTypes } from '../../types/WeightLog';
import Button from '../Button/Button';
import GenericLogModal from '../GenericLogModal/GenericLogModal';
import { defaultValuesConverter, formFields } from '../GenericLogModal/utils';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

import './index.css';

export const WeightLogsList = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const context = useWeightLogsContext();
  if (!context) {
    console.error('WeightLogsContext is not available');
    return null;
  }
  const {
    weightLogs,
    loading,
    error,
    setEditedWeightLog,
    createWeightLog,
    editedWeightLog,
    updateWeightLog,
    deleteWeightLog,
  } = context;

  return (
    <div className="weight-logs__container">
      <div className="weight-logs__header">
        <h3>Weight Logs</h3>
        <Button onClick={() => setOpenDrawer(true)} Icon={AddIcon} />
      </div>
      <div className="weight-logs-list">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {weightLogs.map((log) => (
          <WeightLogItem
            key={log._id}
            weightLog={log}
            onEdit={() => {
              setEditedWeightLog(log);
              setOpenDrawer(true);
            }}
            onDelete={() => deleteWeightLog(log._id)}
          />
        ))}
        {openDrawer && (
          <GenericLogModal<FormWeightLog>
            isOpen={openDrawer}
            title={editedWeightLog ? 'Edit Weight Log' : 'Create Weight Log'}
            onSave={editedWeightLog ? updateWeightLog : createWeightLog}
            defaultValues={
              editedWeightLog ? defaultValuesConverter(editedWeightLog) : null
            }
            fields={formFields(WeightLogTypes[0])}
            onClose={() => {
              setEditedWeightLog(null);
              setOpenDrawer(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
