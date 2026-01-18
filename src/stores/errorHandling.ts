import type { ApiErrorResponse } from '../api/errorHandling';

export const extractErrorMessage = (err: unknown): string => {
  const error = err as ApiErrorResponse;
  return error.message || (error?.error as string) || 'An error occurred';
};

