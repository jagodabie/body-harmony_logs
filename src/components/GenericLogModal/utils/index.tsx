import type { FieldConfig } from '../../../types';
import type { FormLog, LogType, LogUnit, UpdateLogRequest } from '../../../types/BodyLog';

const TYPE_UNIT_MAP: Record<LogType, LogUnit> = {
  weight: 'kg',
  temperature: '°C',
  mood: 'pts',
  activity: 'calories',
  measurement: 'cm',
  energy: 'calories',
  sleep: 'hours',
  exercise: 'min',
  nutrients: 'calories',
  water: 'liters',
};


const VALUE_VALIDATORS: Record<LogType, (value: number) => string> = {
  weight: (value) => {
    if (!value) return 'Value is required';
    if (value < 1 || value > 500) return 'Weight must be between 1 and 500 kg';
    return '';
  },
  temperature: (value) => {
    if (!value) return 'Value is required';
    if (value < 30 || value > 45) return 'Temperature must be between 30 and 45 °C';
    return '';
  },
  mood: (value) => {
    if (value === undefined || value === null || value.toString() === '') return 'Value is required';
    if (value < 0 || value > 10) return 'Mood must be between 0 and 10';
    return '';
  },
  activity: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 5000) return 'Calories must be between 0 and 5000 kcal';
    return '';
  },
  measurement: (value) => {
    if (!value) return 'Value is required';
    if (value < 1 || value > 300) return 'Measurement must be between 1 and 300 cm';
    return '';
  },
  energy: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 10000) return 'Energy must be between 0 and 10000 calories';
    return '';
  },
  sleep: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 24) return 'Sleep must be between 0 and 24 hours';
    return '';
  },
  exercise: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 1440) return 'Exercise must be between 0 and 1440 min';
    return '';
  },
  nutrients: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 10000) return 'Nutrients must be between 0 and 10000 calories';
    return '';
  },
  water: (value) => {
    if (!value) return 'Value is required';
    if (value < 0 || value > 20) return 'Water must be between 0 and 20 liters';
    return '';
  },
};

export const formFields = (type: LogType, label?: string) => {
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
      label: label ?? formatLabel(type),
      type: 'number',
      required: true,
      validator: VALUE_VALIDATORS[type],
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
  return `Body ${formattedType} (${TYPE_UNIT_MAP[type]})`;
};

export const defaultValuesConverter = (log: UpdateLogRequest): FormLog => {
  return {
    date: log.date.split('T')[0], // 2024-01-16T08:00:00.000Z
    value: log.value,
    notes: log.notes,
  };
};