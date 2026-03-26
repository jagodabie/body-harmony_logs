import type { BodyLog } from '../../../../../types/BodyLog';
import { formatDate, formatTime } from '../../../../../utils/dateUtils';
import { ActionButton } from './components/ActionButton/ActionButton';
import { DeleteIcon } from './components/DeleteIcon';
import { EditIcon } from './components/EditIcon';

import './index.css';

type LogItemProps = {
  log: BodyLog;
  onEdit: (log: BodyLog) => void;
  onDelete: (id: string) => void;
  className?: string;
};

export const LogItem = ({
  log,
  onEdit,
  onDelete,
  className = '',
}: LogItemProps) => (
  <div className={`item log-item ${className}`}>
    <div className="log-item__header">
      <div className="log-item__date-time">
        {formatDate(log.date)} {formatTime(log.date)}
      </div>
      <div className="log-item__actions">
        <ActionButton
          onClick={() => onEdit(log)}
          ariaLabel="Edit entry"
          variant="edit"
        >
          <EditIcon />
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(log.id)}
          ariaLabel="Delete entry"
          variant="delete"
        >
          <DeleteIcon />
        </ActionButton>
      </div>
    </div>

    <h2 className="log-item__value">
      {log.value} {log.unit ?? ''}
    </h2>

    {log.notes && (
      <div className="log-item__notes">
        <span className="log-item__notes-label">Notes:</span>
        <p className="log-item__notes-text">{log.notes}</p>
      </div>
    )}
  </div>
);
