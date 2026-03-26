export const LogTypes = ['weight', 'temperature', 'mood', 'activity', 'measurement', 'energy', 'sleep', 'exercise', 'nutrients', 'water'] as const;
export type LogType = typeof LogTypes[number];

export const LogUnits = ['kg', '°C', 'pts', 'min', 'cm', 'lbs', 'inches', 'hours', 'minutes', 'glasses', 'calories', 'liters', null] as const;
export type LogUnit = typeof LogUnits[number];

export type LogTabConfig = {
  type: LogType;
  label: string;
  unit: LogUnit;
};

export type Nullable<T> = T | null;

export type BodyLog = {
  id: string;
  type: LogType;
  value: string;
  unit: LogUnit;
  notes: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type FormLog = {
  value: string;
  notes: string;
  date: string;
};

export type UpdateLogRequest = {
  id: string;
  type: LogType;
  value: string;
  unit: LogUnit;
  notes: string;
  date: string;
};
