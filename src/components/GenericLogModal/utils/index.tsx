import type { FieldConfig } from '../../../types';
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
        validator: (value: string) => {
          if (!value) {
            return 'Date is required';
          }
          return '';
        }
      },
      {
        name: type as FieldConfig['name'],
        label: formatLabel(type),
        type: 'number',
        required: true,
        validator: (value: number) => {
          if (!value) {
            return 'Weight is required';
          }
          if (value < 0) {
            return 'Weight must be greater than 0';
          }
          if (value > 1000) {
            return 'Weight must be less than 1000';
          }
          return '';
        }
      },
      {
        name: 'notes',
        label: 'Note',
        type: 'textarea',
        validator: (value: string) => {
            if (value.length > 100) {
              return 'Note must be less than 100 characters';
            }
            return '';
        }
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