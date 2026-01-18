import { extractErrorMessage } from './errorHandling';
import type { SnackbarType } from './useUIStore';
import { useUIStore } from './useUIStore';

export const showSuccessSnackbar = (message: string): void => {
  useUIStore.getState().showSnackbar(message, 'success');
};

export const showErrorSnackbar = (error: unknown): void => {
  const errorMessage = extractErrorMessage(error);
  useUIStore.getState().showSnackbar(errorMessage, 'error');
};


export const showSnackbar = (message: string, type?: SnackbarType): void => {
  useUIStore.getState().showSnackbar(message, type);
};

export const handleAsyncOperation = async <T,>(options: {
  setLoading: (loading: boolean) => void;
  operation: () => Promise<T>;
  onSuccess?: (result: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
  showSuccessMessage?: string;
  showErrorMessage?: boolean;
}): Promise<T> => {
  const {
    setLoading,
    operation,
    onSuccess,
    onError,
    showSuccessMessage,
    showErrorMessage = true,
  } = options;

  setLoading(true);
  try {
    const result = await operation();
    
    if (onSuccess) {
      await onSuccess(result);
    }
    
    if (showSuccessMessage) {
      showSuccessSnackbar(showSuccessMessage);
    }
    
    return result;
  } catch (error) {
    if (showErrorMessage) {
      showErrorSnackbar(error);
    }
    
    if (onError) {
      onError(error);
    }
    
    throw error;
  } finally {
    setLoading(false);
  }
};
