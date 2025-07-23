export interface WeightLog {
  _id: string;
  type: string;
  value: string;
  unit: string;
  notes: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeightLogRequest {
  type: string;
  value: string;
  unit: string;
  notes: string;
  date: string;
}

export interface UpdateWeightLogRequest extends CreateWeightLogRequest {
  _id: string;
} 