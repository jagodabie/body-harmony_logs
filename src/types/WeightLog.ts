export const WeightLogTypes = ['weight', 'measurement', 'mood', 'energy', 'sleep', 'exercise', 'nutrition', 'water'] as const;
export type WeightLogType = typeof WeightLogTypes[number];

export const WeightLogUnits = ['kg', 'cm', 'lbs', 'inches', 'hours', 'minutes', 'glasses', 'calories', 'liters', null] as const;
export type WeightLogUnit = typeof WeightLogUnits[number];

export type Nullable<T> = T | null;

export interface WeightLog {
  _id: string;
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
  _id: string,
  type: WeightLogType,
  value: string,
  unit: WeightLogUnit,
  notes: string,
  date: string,
} 