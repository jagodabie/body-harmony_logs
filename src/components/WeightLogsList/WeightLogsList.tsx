import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { useWeightLogsContext } from '../../context/WeightLogsContext';
import type { FieldConfig } from '../../types';
import { type FormWeightLog } from '../../types/WeightLog';
import { Button } from '../Button/Button';
import { GenericLogModal } from '../GenericLogModal/GenericLogModal';
import { defaultValuesConverter, formFields } from '../GenericLogModal/utils';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

import './index.css';

export const WeightLogsList = () => {
  const [openModal, setOpenModal] = useState(false);
  const context = useWeightLogsContext();
  if (!context) {
    console.error('WeightLogsContext is not available');
    return null;
  }
  const {
    weightLogs,
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
        <Button onClick={() => setOpenModal(true)} Icon={AddIcon} />
      </div>
      <div className="weight-logs-list">
        {weightLogs.map((log) => (
          <WeightLogItem
            key={log._id}
            weightLog={log}
            onEdit={() => {
              setEditedWeightLog(log);
              setOpenModal(true);
            }}
            onDelete={() => deleteWeightLog(log._id)}
          />
        ))}
        {openModal && (
          <GenericLogModal<FormWeightLog>
            isOpen={openModal}
            title={editedWeightLog ? 'Edit Weight Log' : 'Create Weight Log'}
            onSave={editedWeightLog ? updateWeightLog : createWeightLog}
            defaultValues={
              editedWeightLog ? defaultValuesConverter(editedWeightLog) : null
            }
            fields={formFields('weight') as FieldConfig[]}
            onClose={() => {
              setEditedWeightLog(null);
              setOpenModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
