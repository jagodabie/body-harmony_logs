export const WeightLogTypes = ['weight', 'temperature', 'mood', 'activity', 'measurement', 'energy', 'sleep', 'exercise', 'nutrients', 'water'] as const;
export type WeightLogType = typeof WeightLogTypes[number];

export const WeightLogUnits = ['kg', '°C', 'pts', 'min', 'cm', 'lbs', 'inches', 'hours', 'minutes', 'glasses', 'calories', 'liters', null] as const;
export type WeightLogUnit = typeof WeightLogUnits[number];

export type LogTabConfig = {
  type: WeightLogType;
  label: string;
  unit: WeightLogUnit;
};

export type Nullable<T> = T | null;

export interface WeightLog {
  id: string;
  type: WeightLogType;
  value: string;
  unit: WeightLogUnit;
  notes: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormWeightLog {
  weight: string;
  notes: string;
  date: string;
} 
export interface UpdateWeightLogRequest {
  id: string,
  type: WeightLogType,
  value: string,
  unit: WeightLogUnit,
  notes: string,
  date: string,
} 