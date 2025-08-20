import { useWeightCalculation } from '../../../hooks/useWeightCalculation';
import type { WeightLog } from '../../../types/WeightLog';
import { formatDate, formatTime } from '../../../utils/dateUtils';
import { ActionButton } from './actionButton/ActionButton';
import { DeleteIcon } from './components/DeleteIcon';
import { EditIcon } from './components/EditIcon';

import './index.css';

interface WeightLogItemProps {
  weightLog: WeightLog;
  onEdit: (weightLog: WeightLog) => void;
  onDelete: (id: string) => void;
}

export const WeightLogItem = ({ weightLog, onEdit, onDelete }: WeightLogItemProps) => {
  const { bmi, bmiCategory } = useWeightCalculation({
    weight: parseFloat(weightLog.value),
    height: 170, // TODO: get from user profile
  });

  const bmiCategoryClass = `weight-log-item__bmi-label--${bmiCategory.toLowerCase()}`;

  return (
    <div className="item weight-log-item">
      <div className="weight-log-item__header">
          <div className="weight-log-item__date-time">
              {formatDate(weightLog.date)} {formatTime(weightLog.date)}
          </div>
          <div className="weight-log-item__actions">
            <ActionButton
              onClick={() => onEdit(weightLog)}
              ariaLabel="Edit entry"
              variant="edit"
            >
              <EditIcon />
            </ActionButton>
            <ActionButton
              onClick={() => onDelete(weightLog._id)}
              ariaLabel="Delete entry"
              variant="delete"
            >
              <DeleteIcon />
            </ActionButton>
          </div>       
      </div>

      {/* BMI */}
      <div className="weight-log-item__bmi-section">
      <h2 className="weight-log-item__weight">
          {weightLog.value} kg
        </h2>
        <p className="weight-log-item__bmi">
          BMI: {bmi}
        </p>
        <div className={`weight-log-item__bmi-label ${bmiCategoryClass}`}>
          {bmiCategory}
        </div>
      </div>

      {/* Notes */}
      {weightLog.notes && (
        <div className="weight-log-item__notes">
          <span className="weight-log-item__notes-label">
            Notes:
          </span>
          <p className="weight-log-item__notes-text">
            {weightLog?.notes ?? 'No notes'}
          </p>
        </div>
      )}
    </div>
  );
};
