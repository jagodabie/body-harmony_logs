import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { Button } from '../../../../components/Button/Button';
import { GenericLogModal } from '../../../../components/GenericLogModal/GenericLogModal';
import {
  defaultValuesConverter,
  formFields,
} from '../../../../components/GenericLogModal/utils';
import type { FieldConfig } from '../../../../types';
import type {
  BodyLog,
  FormLog,
  LogType,
  Nullable,
  UpdateLogRequest,
} from '../../../../types/BodyLog';
import { LogItem } from './LogItem/LogItem';

import './index.css';

const TITLE_MAP: Record<string, string> = {
  weight: 'Weight logs',
  temperature: 'Temperature logs',
  mood: 'Mood logs',
  activity: 'Activity logs',
};

type LogListProps = {
  logs: BodyLog[];
  activeType: LogType;
  editedLog: Nullable<UpdateLogRequest>;
  onCreateLog: (data: FormLog) => void;
  onUpdateLog: (data: FormLog) => void;
  onDeleteLog: (id: string) => void;
  onSetEditedLog: (log: Nullable<UpdateLogRequest>) => void;
  className?: string;
};

export const LogList = ({
  logs,
  activeType,
  editedLog,
  onCreateLog,
  onUpdateLog,
  onDeleteLog,
  onSetEditedLog,
  className = '',
}: LogListProps) => {
  const [openModal, setOpenModal] = useState(false);

  const title = TITLE_MAP[activeType] ?? 'Logs';

  return (
    <div className={`log-list ${className}`}>
      <div className="log-list__header">
        <h3>{title}</h3>
        <Button onClick={() => setOpenModal(true)} Icon={AddIcon} />
      </div>

      <div className="log-list__items">
        {logs.map(log => (
          <LogItem
            key={log.id}
            log={log}
            onEdit={() => {
              onSetEditedLog(log);
              setOpenModal(true);
            }}
            onDelete={() => onDeleteLog(log.id)}
          />
        ))}

        {logs.length === 0 && (
          <p className="log-list__empty">No entries</p>
        )}
      </div>

      {openModal && (
        <GenericLogModal<FormLog>
          isOpen={openModal}
          title={editedLog ? `Edit ${activeType} log` : `Create ${activeType} log`}
          onSave={editedLog ? onUpdateLog : onCreateLog}
          defaultValues={
            editedLog ? defaultValuesConverter(editedLog) : null
          }
          fields={formFields(activeType) as FieldConfig[]}
          onClose={() => {
            onSetEditedLog(null);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
};
