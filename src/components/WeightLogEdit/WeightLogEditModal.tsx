import { useWeightLogsContext } from '../../context/WeightLogsContext';
import type { UpdateWeightLogRequest, WeightLogType, WeightLogUnit } from '../../types/WeightLog';
import { FormBase } from '../FormBase/FormBase';
import { defaultValuesConverter, formFields } from './utils';

import './index.css';

const WeightLogEditDrawer = ({ onClose }: { onClose: () => void }) => {
  const context = useWeightLogsContext();
  if (!context) {
    console.error('WeightLogsContext is not available');
    return null;
  }
  const { updateWeightLog, editedWeightLog, setEditedWeightLog } = context;

  if (!editedWeightLog) {
    console.error('No edited weight log');
    return null;
  }

  const onSave = async(formData: Record<string, unknown>) => {
    const updatedLog: UpdateWeightLogRequest = {
      _id: editedWeightLog._id,
      type: editedWeightLog.type,
      value: formData.weight as string,
      unit: formData.unit as WeightLogUnit,
      notes: formData.notes as string,
      date: formData.date as string,
    };
    try {
      await updateWeightLog(updatedLog);
      onClose(); // Close modal after saving
      setEditedWeightLog(null);
    } catch (error) {
      console.error('Error updating weight log:', error);
    }
  };

  return (
    <div className="weight-log-edit-drawer">
        <FormBase
          formTitle="Edit Weight Log"
          fields={formFields(editedWeightLog.type as WeightLogType)}
          onSubmit={(formData) => onSave(formData as Record<string, unknown>)}
          defaultValues={defaultValuesConverter(editedWeightLog)}
          handleClose={onClose}
        />
    </div>
  );
};

export default WeightLogEditDrawer;