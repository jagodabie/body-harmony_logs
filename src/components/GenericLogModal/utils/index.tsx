import type { FieldConfig } from '../../../types';
import type { FormLog, LogType, UpdateLogRequest } from '../../../types/BodyLog';
import { LogUnits } from '../../../types/BodyLog';


export const formFields = (type: LogType) => {
  return [
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
      },
    },
    {
      name: 'value' as FieldConfig['name'],
      label: formatLabel(type),
      type: 'number',
      required: true,
      validator: (value: number) => {
        if (!value) {
          return 'Value is required';
        }
        if (value < 0) {
          return 'Value must be greater than 0';
        }
        if (value > 1000) {
          return 'Value must be less than 1000';
        }
        return '';
      },
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
      },
    },
  ];
};

const formatLabel = (type: LogType) => {
  const formattedType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  return `Body ${formattedType} (${LogUnits[0]})`;
};

export const defaultValuesConverter = (log: UpdateLogRequest): FormLog => {
  return {
    date: log.date.split('T')[0], // 2024-01-16T08:00:00.000Z
    value: log.value,
    notes: log.notes,
  };
};