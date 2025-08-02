import type { FormWeightLog, UpdateWeightLogRequest, WeightLogType } from '../../../types/WeightLog';
import { WeightLogUnits } from '../../../types/WeightLog';


export const formFields = (
  type: WeightLogType,
)=> {
  return (
    [
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        placeholder: '',
      },
      {
        name: type,
        label: formatLabel(type),
        type: 'number',
        required: true,
        placeholder: 'e.g. 67.5',
      },
      {
        name: 'notes',
        label: 'Note',
        type: 'textarea',
        placeholder: 'e.g. I felt tired today',
      }
    ]
  );
};

const formatLabel = (type: WeightLogType) => {
  const formattedType= type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  return `Body ${formattedType} (${WeightLogUnits[0]})`;
};

export const defaultValuesConverter = (weightLog: UpdateWeightLogRequest): FormWeightLog => {
    return {
      date: weightLog.date.split('T')[0], // 2024-01-16T08:00:00.000Z
      weight: weightLog.value,
      notes: weightLog.notes,
    };
  };