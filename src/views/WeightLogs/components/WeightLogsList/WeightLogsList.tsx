import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { Button } from '../../../../components/Button/Button';
import { GenericLogModal } from '../../../../components/GenericLogModal/GenericLogModal';
import {
  defaultValuesConverter,
  formFields,
} from '../../../../components/GenericLogModal/utils';
import { useWeightLogsStore } from '../../../../stores/useWeightLogsStore';
import type { FieldConfig } from '../../../../types';
import { type FormWeightLog } from '../../../../types/WeightLog';
import { WeightLogItem } from './WeightLogItem/WeightLogItem';

import './index.css';

export const WeightLogsList = () => {
  const [openModal, setOpenModal] = useState(false);
  const {
    weightLogs,
    setEditedWeightLog,
    createWeightLog,
    editedWeightLog,
    updateWeightLog,
    deleteWeightLog,
  } = useWeightLogsStore();

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

